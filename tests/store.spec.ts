import { expect, test } from "@playwright/test";

test("home mostra capa, mais vendidos e vantagens de membro", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Vista seu sonho" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Os mais vendidos" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Vantagens de membro" })).toBeVisible();
  await expect(page.getByRole("timer")).toBeVisible();
});

test("busca encontra produtos pela API", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: /buscar/i })
    .first()
    .click();
  await page.getByPlaceholder(/buscar moletom/i).fill("cargo");
  await expect(page.getByRole("link", { name: /calça cargo orbit/i })).toBeVisible();
});

test("produto exige tamanho, adiciona à sacola e aplica cupom", async ({ page }) => {
  await page.goto("/produto/calca-cargo-orbit");
  await page.getByRole("button", { name: "Adicionar à sacola" }).click();
  await expect(page.getByText(/selecione um tamanho para adicionar/i)).toBeVisible();

  await page.getByRole("radio", { name: "M", exact: true }).check({ force: true });
  await page.getByRole("button", { name: "Adicionar à sacola" }).click();

  const bag = page.getByRole("dialog", { name: /sacola/i });
  await expect(bag).toBeVisible();
  await expect(bag.getByText("Calça Cargo Orbit")).toBeVisible();
  await expect(bag.getByText(/faltam R\$\s?69,10 para o frete grátis/i)).toBeVisible();

  await bag.getByPlaceholder("Cupom de desconto").fill("errado");
  await bag.getByRole("button", { name: "Aplicar" }).click();
  await expect(bag.getByText(/não existe ou expirou/i)).toBeVisible();

  await bag.getByPlaceholder("Cupom de desconto").fill("dream10");
  await bag.getByRole("button", { name: "Aplicar" }).click();
  await expect(bag.getByText("Cupom DREAM10", { exact: true })).toBeVisible();
});

test("cadastro de membro valida email", async ({ page }) => {
  await page.goto("/#membros");
  const input = page.getByLabel("Email");
  await input.fill("nome@");
  await page.getByRole("button", { name: "Quero meu cupom" }).click();
  await expect(page.getByText(/parece incompleto/i)).toBeVisible();
  await input.fill("nome@email.com");
  await page.getByRole("button", { name: "Quero meu cupom" }).click();
  await expect(page.getByText("Bem-vindo ao Clube Dream.")).toBeVisible();
});

test("página inexistente mostra 404 da marca", async ({ page }) => {
  const res = await page.goto("/produto/nao-existe");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Essa página saiu do drop" })).toBeVisible();
});
