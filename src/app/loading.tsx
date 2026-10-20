// Affiché instantanément pendant le chargement d'une page : l'élève voit tout de suite que son clic a marché.
export default function Loading() {
  return (
    <div className="animate-pulse space-y-5" aria-busy="true" aria-label="Chargement">
      <div className="h-4 w-48 rounded bg-sand" />
      <div className="h-10 w-72 rounded-lg bg-sand" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="h-20 rounded-2xl bg-sand" /><div className="h-20 rounded-2xl bg-sand" /><div className="h-20 rounded-2xl bg-sand" />
      </div>
    </div>
  )
}
