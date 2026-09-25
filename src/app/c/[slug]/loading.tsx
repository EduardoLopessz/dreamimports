export default function Loading() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 pt-8 md:px-12" aria-busy="true" aria-label="Carregando produtos">
      <div className="h-8 w-48 animate-pulse rounded bg-surface" />
      <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="space-y-3">
            <div className="aspect-square animate-pulse bg-surface" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-surface" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-surface" />
          </li>
        ))}
      </ul>
    </div>
  );
}
