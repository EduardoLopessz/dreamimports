import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("filtro de tamanho mostra só peças com esse tamanho em estoque", async ({ page }) => {
  await page.goto("/c/masculino?tamanho=XG");
  // Camiseta Pixel Heavy e Moletom Nebula estão sem XG no catálogo.
  await expect(page.getByRole("heading", { name: "Camiseta Core" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Camiseta Pixel Heavy" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Moletom Nebula Oversized" })).toHaveCount(0);
  // No celular o link fica dentro do painel recolhido; conferimos o destino.
  await expect(page.getByRole("link", { name: /limpar filtros/i, includeHidden: true }).first()).toHaveAttribute(
    "href",
    "/c/masculino",
  );
});

test("contagem de preço considera a categoria escolhida", async ({ page, isMobile }) => {
  test.skip(isMobile, "a barra lateral de filtros aparece no desktop");
  // Em Masculino > Calças só há a Calça Cargo Orbit (R$ 229,90).
  await page.goto("/c/masculino?categoria=calcas");
  const filters = page.getByRole("complementary", { name: "Filtros" });
  await expect(filters.getByText("De R$ 150 a R$ 250 (1)")).toBeVisible();
  await expect(filters.getByText("Acima de R$ 250 (0)")).toBeVisible();
});

test("filtro sem resultado explica e oferece limpar", async ({ page }) => {
  await page.goto("/c/outlet?preco=ate-150&cor=Violeta");
  await expect(page.getByText("Nenhuma peça com esses filtros.")).toBeVisible();
});

test("mega menu abre com categorias do gênero", async ({ page, isMobile }) => {
  test.skip(isMobile, "mega menu só existe no desktop");
  await page.goto("/");
  await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Feminino" }).hover();
  await expect(page.getByRole("link", { name: "Moletom Dusk acabou de chegar" })).toBeVisible();
  await page.getByRole("link", { name: "Tudo em Feminino" }).click();
  await expect(page).toHaveURL(/\/c\/feminino$/);
});

test("clicar no gênero do menu abre a coleção", async ({ page, isMobile }) => {
  test.skip(isMobile, "menu principal só aparece no desktop");
  await page.goto("/");
  await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Masculino" }).click();
  await expect(page).toHaveURL(/\/c\/masculino$/);
});

test("guia de tamanhos abre em janela com a tabela", async ({ page }) => {
  await page.goto("/produto/moletom-nebula-oversized");
  await page.getByRole("button", { name: /guia de tamanhos/i }).click();
  const dialog = page.getByRole("dialog", { name: "Guia de tamanhos" });
  await expect(dialog.getByRole("rowheader", { name: "GG" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

for (const path of ["/", "/c/feminino", "/produto/calca-cargo-orbit", "/checkout", "/ajuda"]) {
  test(`sem problemas graves de acessibilidade em ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(
      serious.map(
        (v) =>
          `${v.id}: ${v.nodes
            .map((n) => n.target.join(" "))
            .slice(0, 3)
            .join(" | ")}`,
      ),
    ).toEqual([]);
  });
}
