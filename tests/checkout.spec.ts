import { expect, test } from "@playwright/test";

// ViaCEP simulado: os testes não dependem da rede externa.
test.beforeEach(async ({ page }) => {
  await page.route("https://viacep.com.br/**", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: route.request().url().includes("99999999")
        ? JSON.stringify({ erro: true })
        : JSON.stringify({ logradouro: "Avenida Paulista", bairro: "Bela Vista", localidade: "São Paulo", uf: "SP" }),
    }),
  );
});

async function addCargoToBag(page: import("@playwright/test").Page) {
  await page.goto("/produto/calca-cargo-orbit");
  await page.getByRole("radio", { name: "M", exact: true }).check({ force: true });
  await page.getByRole("button", { name: "Adicionar à sacola" }).click();
  await expect(page.getByRole("dialog", { name: /sacola/i })).toBeVisible();
}

test("checkout completo no cartão com CEP preenchendo o endereço", async ({ page }) => {
  await addCargoToBag(page);
  await page.getByRole("link", { name: "Finalizar compra" }).click();
  await expect(page).toHaveURL(/\/checkout$/);

  await page.getByLabel("Email").fill("larissa@email.com");
  await page.getByLabel("Nome completo").fill("Larissa Okamoto");
  await page.getByLabel("Celular").fill("11912345678");
  await page.getByLabel("CEP").fill("01310100");
  await expect(page.getByLabel("Rua")).toHaveValue("Avenida Paulista");
  await expect(page.getByLabel("Estado")).toHaveValue("SP");
  await page.getByLabel("Número").fill("1000");

  await page.getByText("Cartão de crédito").click();
  await page.getByLabel("Número do cartão").fill("4111111111111111");
  await page.getByLabel("Nome impresso no cartão").fill("Larissa Okamoto");
  await page.getByLabel("Validade").fill("1230");
  await page.getByLabel("CVV").fill("123");
  await page.getByLabel("Parcelas").selectOption("3");
  await page.getByRole("button", { name: "Confirmar pedido" }).click();

  await expect(page).toHaveURL(/\/pedido\/DS-/);
  await expect(page.getByRole("heading", { name: "Pedido confirmado" })).toBeVisible();
  await expect(page.getByText("Avenida Paulista, 1000")).toBeVisible();
  await expect(page.getByText("3x de")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sacola vazia" })).toBeVisible();
});

test("checkout aponta campos inválidos e cartão com número errado", async ({ page }) => {
  await addCargoToBag(page);
  await page.goto("/checkout");
  await page.getByRole("button", { name: "Pagar com Pix" }).click();
  await expect(page.getByText("Digite um email válido, como voce@email.com.")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeFocused();

  await page.getByText("Cartão de crédito").click();
  await page.getByLabel("Número do cartão").fill("4111111111111112");
  await page.getByRole("button", { name: "Confirmar pedido" }).click();
  await expect(page.getByText("Confira o número do cartão.")).toBeVisible();
});

test("checkout com sacola vazia leva aos lançamentos", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page.getByText("Sua sacola está vazia")).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver lançamentos" })).toBeVisible();
});

test("CEP inexistente tira o endereço do CEP anterior, mas mantém o que foi digitado", async ({ page }) => {
  await addCargoToBag(page);
  await page.goto("/checkout");
  await page.getByLabel("CEP").fill("01310100");
  await expect(page.getByLabel("Rua")).toHaveValue("Avenida Paulista");
  await page.getByLabel("Bairro").fill("Jardins"); // digitado pela pessoa
  await page.getByLabel("CEP").fill("99999999");
  await expect(page.getByText("Não encontramos esse CEP")).toBeVisible();
  await expect(page.getByLabel("Rua")).toHaveValue("");
  await expect(page.getByLabel("Cidade")).toHaveValue("");
  await expect(page.getByLabel("Bairro")).toHaveValue("Jardins");
});

test("cupom aplicado pode ser removido na sacola", async ({ page }) => {
  await addCargoToBag(page);
  const bag = page.getByRole("dialog", { name: /sacola/i });
  await bag.getByPlaceholder("Cupom de desconto").fill("dream10");
  await bag.getByRole("button", { name: "Aplicar" }).click();
  await expect(bag.getByText("aplicado")).toBeVisible();
  await bag.getByRole("button", { name: "Remover cupom DREAM10" }).click();
  await expect(bag.getByPlaceholder("Cupom de desconto")).toBeVisible();
});
