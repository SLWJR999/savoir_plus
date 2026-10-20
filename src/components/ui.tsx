import Link from 'next/link'
export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav className="mb-4 flex flex-wrap gap-1 text-sm text-slate-500" aria-label="Fil d'Ariane">
      {items.map((it, i) => (
        <span key={i}>{it.href ? <Link href={it.href} className="hover:underline">{it.label}</Link> : <span className="text-ink">{it.label}</span>}{i < items.length - 1 && ' / '}</span>
      ))}
    </nav>
  )
}
export function Title({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return <div className="mb-5"><h1 className="text-2xl font-bold">{children}</h1>{sub && <p className="mt-1 text-sm text-slate-600">{sub}</p>}</div>
}
export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">{children}</p>
}
export const subjectColor: Record<string, string> = { maths: 'border-l-maths', pc: 'border-l-pc', svt: 'border-l-svt' }
export function fmtSize(n: number | null) { return n ? (n > 1048576 ? (n / 1048576).toFixed(1) + ' Mo' : Math.max(1, Math.round(n / 1024)) + ' Ko') : '' }
