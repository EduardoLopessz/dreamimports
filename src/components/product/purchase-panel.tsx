"use client";

import { AnimatePresence, m } from "motion/react";
import { useState } from "react";
import { Label, Radio, RadioGroup } from "react-aria-components";
import { CheckIcon, EyeIcon, TruckIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { ProductColor, ProductImage, ProductSize } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { FavoriteButton } from "./favorite-button";
import { SizeGuide } from "./size-guide";

type Props = {
  product: {
    slug: string;
    name: string;
    subtitle: string;
    priceCents: number;
    image: ProductImage;
    colors: ProductColor[];
    sizes: ProductSize[];
  };
};

export function PurchasePanel({ product }: Props) {
  const add = useCart((s) => s.add);
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const selected = product.sizes.find((s) => s.label === size);
  // Número estável por produto, só para a prova social de demonstração.
  const viewers = 9 + ((product.slug.length * 7) % 23);

  function addToBag() {
    if (!size) {
      setError(true);
      return;
    }
    add({
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      priceCents: product.priceCents,
      imageId: product.image.pexelsId,
      imageAlt: product.image.alt,
      size,
      color,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="mt-8 space-y-8">
      <RadioGroup value={color} onChange={setColor} className="space-y-3">
        <Label className="font-medium">
          Cor: <span className="font-normal text-muted">{color}</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <Radio
              key={c.name}
              value={c.name}
              aria-label={c.name}
              className="grid size-11 cursor-pointer place-items-center rounded-full border-2 border-transparent outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-accent data-[selected]:border-ink"
            >
              <span className="size-8 rounded-full border border-line" style={{ backgroundColor: c.hex }} />
            </Radio>
          ))}
        </div>
      </RadioGroup>

      <RadioGroup
        value={size}
        onChange={(v) => {
          setSize(v);
          setError(false);
        }}
        isInvalid={error}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <Label className={cn("font-medium", error && "text-sale")}>Selecione o tamanho</Label>
          <SizeGuide />
        </div>
        <div
          className={cn(
            "grid grid-cols-5 gap-2 rounded-lg",
            error && "outline outline-1 outline-offset-4 outline-sale",
          )}
        >
          {product.sizes.map((s) => (
            <Radio
              key={s.label}
              value={s.label}
              isDisabled={s.stock === 0}
              className="grid h-12 cursor-pointer place-items-center rounded-lg border border-line text-base font-medium transition-colors outline-none hover:border-ink data-[disabled]:cursor-not-allowed data-[disabled]:bg-surface data-[disabled]:text-muted/50 data-[disabled]:line-through data-[focus-visible]:ring-2 data-[focus-visible]:ring-accent data-[selected]:border-ink data-[selected]:ring-1 data-[selected]:ring-ink"
            >
              {s.label}
            </Radio>
          ))}
        </div>
        {error && (
          <p className="text-sm text-sale" role="alert">
            Selecione um tamanho para adicionar à sacola.
          </p>
        )}
        {selected && selected.stock <= 4 && (
          <p className="text-sm font-medium text-sale">
            {selected.stock === 1 ? "Última unidade" : `Só restam ${selected.stock}`} no tamanho {selected.label}
          </p>
        )}
      </RadioGroup>

      <div className="flex gap-2">
        <Button size="lg" className="relative flex-1 overflow-hidden" onClick={addToBag}>
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={added ? "ok" : "add"}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2"
            >
              {added ? (
                <>
                  <CheckIcon size={20} /> Adicionado
                </>
              ) : (
                "Adicionar à sacola"
              )}
            </m.span>
          </AnimatePresence>
        </Button>
        <FavoriteButton slug={product.slug} name={product.name} className="size-14 border border-line" />
      </div>

      <p className="flex items-center gap-2 text-sm text-muted">
        <EyeIcon size={18} aria-hidden /> {viewers} pessoas estão vendo este produto agora
      </p>

      <ShippingEstimator />
    </div>
  );
}

function ShippingEstimator() {
  const [cep, setCep] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setResult(null);
      return setError("Digite um CEP com 8 números.");
    }
    setError(null);
    // Estimativa de demonstração por região (primeiro dígito do CEP).
    const region = Number(digits[0]);
    const days = region <= 3 ? [2, 4] : region <= 5 ? [4, 7] : region <= 7 ? [5, 8] : [3, 6];
    const from = new Date();
    const to = new Date();
    from.setDate(from.getDate() + days[0]);
    to.setDate(to.getDate() + days[1]);
    const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    setResult(`Chega entre ${fmt(from)} e ${fmt(to)}. Grátis acima de R$ 299.`);
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl bg-surface p-4">
      <label htmlFor="cep" className="flex items-center gap-2 text-sm font-medium">
        <TruckIcon size={18} aria-hidden /> Calcular entrega
      </label>
      <div className="mt-3 flex gap-2">
        <input
          id="cep"
          inputMode="numeric"
          autoComplete="postal-code"
          value={cep}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, "").slice(0, 8);
            setCep(d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d);
          }}
          placeholder="00000-000"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "cep-erro" : result ? "cep-resultado" : undefined}
          className="h-11 flex-1 rounded-full border border-line bg-white px-4 outline-none focus:border-ink"
        />
        <Button type="submit" variant="secondary" size="sm" className="h-11">
          Calcular
        </Button>
      </div>
      {error && (
        <p id="cep-erro" className="mt-2 text-sm text-sale">
          {error}
        </p>
      )}
      {result && (
        <p id="cep-resultado" className="mt-2 text-sm" aria-live="polite">
          {result}
        </p>
      )}
    </form>
  );
}
