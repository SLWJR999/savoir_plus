// Affiché instantanément pendant le chargement d'une page : l'élève voit tout de suite que son clic a marché.
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Chargement">
      <div className="h-4 w-40 rounded bg-slate-200" />
      <div className="h-8 w-64 rounded bg-slate-200" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="h-16 rounded-xl bg-slate-200" />
        <div className="h-16 rounded-xl bg-slate-200" />
        <div className="h-16 rounded-xl bg-slate-200" />
      </div>
    </div>
  )
}
