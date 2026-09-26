"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { CreditCardIcon, HandbagIcon, ShieldCheckIcon, TruckIcon } from "@/components/icons";
import { PixIcon } from "@/components/payment-icons";
import { Photo } from "@/components/photo";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  EMAIL,
  newOrderStamp,
  ORDER_KEY,
  SHIPPING,
  UFS,
  expiryValid,
  installmentOptions,
  lookupCep,
  luhn,
  maskCard,
  maskCep,
  maskExpiry,
  maskPhone,
  onlyDigits,
  orderTotals,
  type Address,
  type PaymentMethod,
  type SavedOrder,
  type ShippingKey,
} from "@/lib/checkout";
import { cn, formatPrice } from "@/lib/utils";
import { cartDiscount, cartSubtotal, itemKey, useCart } from "@/store/cart";

type Fields = {
  email: string;
  name: string;
  phone: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
} & Address;

const EMPTY: Fields = {
  email: "",
  name: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  uf: "",
  cardNumber: "",
  cardName: "",
  cardExpiry: "",
  cardCvv: "",
};

/** true depois que a sacola salva no navegador foi carregada (evita piscar "sacola vazia"). */
function useCartHydrated() {
  return useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}

function validate(f: Fields, payment: PaymentMethod) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!EMAIL.test(f.email.trim())) e.email = "Digite um email válido, como voce@email.com.";
  if (f.name.trim().split(/\s+/).length < 2) e.name = "Digite nome e sobrenome.";
  if (onlyDigits(f.phone).length < 10) e.phone = "Digite o celular com DDD.";
  if (onlyDigits(f.cep).length !== 8) e.cep = "Digite um CEP com 8 números.";
  if (!f.street.trim()) e.street = "Digite a rua.";
  if (!f.number.trim()) e.number = "Digite o número ou S/N.";
  if (!f.district.trim()) e.district = "Digite o bairro.";
  if (!f.city.trim()) e.city = "Digite a cidade.";
  if (!UFS.includes(f.uf)) e.uf = "Escolha o estado.";
  if (payment === "cartao") {
    if (!luhn(f.cardNumber)) e.cardNumber = "Confira o número do cartão.";
    if (f.cardName.trim().length < 3) e.cardName = "Digite o nome como está no cartão.";
    if (!expiryValid(f.cardExpiry)) e.cardExpiry = "Validade inválida ou vencida (MM/AA).";
    if (!/^\d{3,4}$/.test(f.cardCvv)) e.cardCvv = "O código tem 3 ou 4 números.";
  }
  return e;
}

export function CheckoutForm() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const items = useCart((s) => s.items);
  const subtotal = useCart(cartSubtotal);
  const discount = useCart(cartDiscount);
  const coupon = useCart((s) => s.coupon);
  const clear = useCart((s) => s.clear);

  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [shipping, setShipping] = useState<ShippingKey>("economica");
  const [payment, setPayment] = useState<PaymentMethod>("pix");
  const [installments, setInstallments] = useState(1);
  const [cepState, setCepState] = useState<"idle" | "loading" | "found" | "notfound" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const totals = orderTotals(subtotal, discount, shipping, payment);

  const cepRequest = useRef<AbortController | null>(null);
  /** Último endereço preenchido pelo CEP: só ele pode ser sobrescrito ou limpo automaticamente. */
  const autoAddress = useRef<Partial<Address>>({});
  useEffect(() => () => cepRequest.current?.abort(), []);

  const ADDRESS_KEYS = ["street", "district", "city", "uf"] as const;

  /** Aplica (ou limpa) o endereço automático sem apagar o que a pessoa digitou. */
  function applyAutoAddress(next: Partial<Address>) {
    const prevAuto = autoAddress.current;
    setF((prev) => {
      const out = { ...prev };
      for (const k of ADDRESS_KEYS) {
        const untouched = !prev[k] || prev[k] === prevAuto[k];
        if (untouched) out[k] = next[k] ?? "";
      }
      return out;
    });
    autoAddress.current = next;
  }

  /** Busca o endereço assim que o CEP chega a 8 números (no evento, não num efeito). */
  function changeCep(value: string) {
    const masked = maskCep(value);
    set("cep", masked);
    cepRequest.current?.abort();
    const digits = onlyDigits(masked);
    if (digits.length !== 8) return setCepState("idle");
    const ctrl = new AbortController();
    cepRequest.current = ctrl;
    setCepState("loading");
    lookupCep(digits, ctrl.signal)
      .then((addr) => {
        if (!addr) {
          applyAutoAddress({}); // tira o endereço do CEP anterior
          return setCepState("notfound");
        }
        applyAutoAddress(addr);
        setErrors((prev) => ({
          ...prev,
          cep: undefined,
          street: undefined,
          district: undefined,
          city: undefined,
          uf: undefined,
        }));
        setCepState("found");
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        applyAutoAddress({});
        setCepState("error");
      });
  }

  function set<K extends keyof Fields>(key: K, value: string) {
    setF((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(f, payment);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    const order: SavedOrder = {
      ...newOrderStamp(),
      email: f.email.trim(),
      name: f.name.trim(),
      address: {
        cep: f.cep,
        street: f.street,
        number: f.number,
        complement: f.complement,
        district: f.district,
        city: f.city,
        uf: f.uf,
      },
      shipping,
      payment,
      installments: payment === "cartao" ? installments : 1,
      items: items.map((i) => ({
        name: i.name,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        priceCents: i.priceCents,
        imageId: i.imageId,
        imageAlt: i.imageAlt,
      })),
      totals: { ...totals, subtotal, discount, coupon },
    };
    // Dados do cartão nunca são guardados. A sacola é esvaziada na página de confirmação,
    // para não piscar "sacola vazia" aqui enquanto a próxima página carrega.
    try {
      sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
    } catch {
      clear(); // sem sessionStorage a confirmação não acha o pedido; esvazia agora
    }
    router.push(`/pedido/${order.id}`);
  }

  if (!hydrated) {
    return (
      <div
        className="mt-10 h-96 animate-pulse rounded-3xl bg-surface"
        aria-busy="true"
        aria-label="Carregando sacola"
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <HandbagIcon size={48} className="text-muted" />
        <p className="text-lg font-medium">Sua sacola está vazia</p>
        <p className="text-muted">Adicione peças para finalizar a compra.</p>
        <ButtonLink href="/c/lancamentos">Ver lançamentos</ButtonLink>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className="space-y-12">
        <Section step={1} title="Seus dados">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={f.email}
              onChange={(v) => set("email", v)}
              error={errors.email}
              className="sm:col-span-2"
            />
            <Field
              label="Nome completo"
              name="name"
              autoComplete="name"
              value={f.name}
              onChange={(v) => set("name", v)}
              error={errors.name}
            />
            <Field
              label="Celular"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="(11) 91234-5678"
              value={f.phone}
              onChange={(v) => set("phone", maskPhone(v))}
              error={errors.phone}
            />
          </div>
        </Section>

        <Section step={2} title="Entrega">
          <div className="grid gap-4 sm:grid-cols-6">
            <Field
              label="CEP"
              name="cep"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000"
              value={f.cep}
              onChange={changeCep}
              error={errors.cep}
              className="sm:col-span-2"
              hint={
                cepState === "loading"
                  ? "Buscando endereço..."
                  : cepState === "found"
                    ? "Endereço encontrado. Confira o número."
                    : cepState === "notfound"
                      ? "Não encontramos esse CEP. Confira ou preencha o endereço."
                      : cepState === "error"
                        ? "Não conseguimos buscar o CEP agora. Preencha o endereço."
                        : undefined
              }
            />
            <Field
              label="Rua"
              name="street"
              autoComplete="address-line1"
              value={f.street}
              onChange={(v) => set("street", v)}
              error={errors.street}
              className="sm:col-span-4"
            />
            <Field
              label="Número"
              name="number"
              inputMode="numeric"
              value={f.number}
              onChange={(v) => set("number", v)}
              error={errors.number}
              className="sm:col-span-2"
            />
            <Field
              label="Complemento (opcional)"
              name="complement"
              autoComplete="address-line2"
              value={f.complement}
              onChange={(v) => set("complement", v)}
              className="sm:col-span-4"
            />
            <Field
              label="Bairro"
              name="district"
              value={f.district}
              onChange={(v) => set("district", v)}
              error={errors.district}
              className="sm:col-span-2"
            />
            <Field
              label="Cidade"
              name="city"
              autoComplete="address-level2"
              value={f.city}
              onChange={(v) => set("city", v)}
              error={errors.city}
              className="sm:col-span-3"
            />
            <div className="sm:col-span-1">
              <label htmlFor="uf" className="text-sm font-medium">
                Estado
              </label>
              <select
                id="uf"
                name="uf"
                autoComplete="address-level1"
                value={f.uf}
                onChange={(e) => set("uf", e.target.value)}
                aria-invalid={errors.uf ? true : undefined}
                aria-describedby={errors.uf ? "uf-erro" : undefined}
                className={cn(inputClass, "mt-1.5 appearance-none", errors.uf && "border-sale")}
              >
                <option value="">UF</option>
                {UFS.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
              {errors.uf && (
                <p id="uf-erro" className="mt-1.5 text-sm text-sale">
                  {errors.uf}
                </p>
              )}
            </div>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-medium">Frete</legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {(Object.keys(SHIPPING) as ShippingKey[]).map((key) => {
                const opt = SHIPPING[key];
                const price = opt.priceCents(totals.goods);
                return (
                  <Choice key={key} name="shipping" checked={shipping === key} onChange={() => setShipping(key)}>
                    <TruckIcon size={22} aria-hidden />
                    <span className="flex-1">
                      <span className="block font-medium">{opt.label}</span>
                      <span className="block text-sm text-muted">{opt.days}</span>
                    </span>
                    <span className={cn("font-medium", price === 0 && "text-pix")}>
                      {price === 0 ? "Grátis" : formatPrice(price)}
                    </span>
                  </Choice>
                );
              })}
            </div>
          </fieldset>
        </Section>

        <Section step={3} title="Pagamento">
          <fieldset>
            <legend className="sr-only">Forma de pagamento</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice name="payment" checked={payment === "pix"} onChange={() => setPayment("pix")}>
                <PixIcon size={22} aria-hidden />
                <span className="flex-1">
                  <span className="block font-medium">Pix</span>
                  <span className="block text-sm text-pix">5% de desconto, aprovação na hora</span>
                </span>
              </Choice>
              <Choice name="payment" checked={payment === "cartao"} onChange={() => setPayment("cartao")}>
                <CreditCardIcon size={22} aria-hidden />
                <span className="flex-1">
                  <span className="block font-medium">Cartão de crédito</span>
                  <span className="block text-sm text-muted">Até 10x sem juros</span>
                </span>
              </Choice>
            </div>
          </fieldset>

          {payment === "pix" ? (
            <p className="mt-4 rounded-2xl bg-surface p-4 text-sm">
              Você paga <strong className="font-medium">{formatPrice(totals.pixTotal)}</strong> no Pix. Numa loja real,
              o QR Code para pagar pelo app do banco aparece na próxima tela.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-4">
              <Field
                label="Número do cartão"
                name="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="0000 0000 0000 0000"
                value={f.cardNumber}
                onChange={(v) => set("cardNumber", maskCard(v))}
                error={errors.cardNumber}
                className="sm:col-span-4"
              />
              <Field
                label="Nome impresso no cartão"
                name="cardName"
                autoComplete="cc-name"
                value={f.cardName}
                onChange={(v) => set("cardName", v.toUpperCase())}
                error={errors.cardName}
                className="sm:col-span-2"
              />
              <Field
                label="Validade"
                name="cardExpiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/AA"
                value={f.cardExpiry}
                onChange={(v) => set("cardExpiry", maskExpiry(v))}
                error={errors.cardExpiry}
              />
              <Field
                label="CVV"
                name="cardCvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                value={f.cardCvv}
                onChange={(v) => set("cardCvv", onlyDigits(v).slice(0, 4))}
                error={errors.cardCvv}
              />
              <div className="sm:col-span-4">
                <label htmlFor="installments" className="text-sm font-medium">
                  Parcelas
                </label>
                <select
                  id="installments"
                  value={installments}
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  className={cn(inputClass, "mt-1.5 appearance-none")}
                >
                  {installmentOptions(totals.total).map((o) => (
                    <option key={o.n} value={o.n}>
                      {o.n}x de {formatPrice(o.value)} sem juros
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </Section>
      </div>

      <aside aria-label="Resumo do pedido" className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl bg-surface p-6">
          <h2 className="text-xl font-medium">Resumo</h2>
          <ul className="mt-4 divide-y divide-line">
            {items.map((i) => (
              <li key={itemKey(i)} className="flex gap-3 py-3">
                <Photo
                  image={{ pexelsId: i.imageId, alt: i.imageAlt }}
                  sizes="64px"
                  className="size-16 shrink-0 rounded-lg"
                />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-muted">
                    {i.color}, {i.size}, {i.quantity} un.
                  </p>
                </div>
                <p className="text-sm font-medium">{formatPrice(i.priceCents * i.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(subtotal)} />
            {discount > 0 && <Row label={`Cupom ${coupon}`} value={`−${formatPrice(discount)}`} className="text-pix" />}
            <Row
              label={`Frete (${SHIPPING[shipping].label})`}
              value={totals.freight === 0 ? "Grátis" : formatPrice(totals.freight)}
            />
            {payment === "pix" && (
              <Row
                label="Desconto Pix (5%)"
                value={`−${formatPrice(totals.total - totals.pixTotal)}`}
                className="text-pix"
              />
            )}
            <div className="flex justify-between border-t border-line pt-3 text-lg font-medium">
              <dt>Total</dt>
              <dd>{formatPrice(totals.charged)}</dd>
            </div>
            {payment === "cartao" && installments > 1 && (
              <p className="text-right text-muted">
                {installments}x de {formatPrice(Math.round(totals.total / installments))} sem juros
              </p>
            )}
          </dl>
          <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
            {submitting ? "Confirmando..." : payment === "pix" ? "Pagar com Pix" : "Confirmar pedido"}
          </Button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
            <ShieldCheckIcon size={16} aria-hidden /> Ambiente seguro. Troca grátis em 30 dias.
          </p>
        </div>
      </aside>
    </form>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-base outline-none transition-colors focus:border-ink aria-invalid:border-sale";

function Field({
  label,
  name,
  value,
  onChange,
  error,
  hint,
  className,
  ...rest
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "name">) {
  const id = useId();
  const msgId = `${id}-msg`;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? msgId : undefined}
        className={cn(inputClass, "mt-1.5")}
        {...rest}
      />
      {(error || hint) && (
        <p id={msgId} className={cn("mt-1.5 text-sm", error ? "text-sale" : "text-muted")} aria-live="polite">
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`etapa-${step}`}>
      <h2 id={`etapa-${step}`} className="flex items-center gap-3 text-2xl font-medium">
        <span className="grid size-8 place-items-center rounded-full bg-ink text-sm text-white" aria-hidden>
          {step}
        </span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Choice({
  name,
  checked,
  onChange,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
        checked ? "border-ink bg-white ring-1 ring-ink" : "border-line hover:border-muted",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("flex justify-between", className)}>
      <dt className={className ? undefined : "text-muted"}>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
