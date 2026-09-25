import type { Metadata } from "next";
import { PRODUCTS } from "@/db/data";
import { FavoritesGrid } from "./favorites-grid";

export const metadata: Metadata = { title: "Favoritos", robots: { index: false } };

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 pt-8 md:px-12">
      <h1 className="text-2xl font-medium">Favoritos</h1>
      <FavoritesGrid products={PRODUCTS} />
    </div>
  );
}
