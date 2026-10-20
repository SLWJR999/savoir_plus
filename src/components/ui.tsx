import Link from 'next/link'

const P: Record<string, string> = {
  home: 'M3 11l9-8 9 8M5 10v10h14V10',
  book: 'M4 19V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2zm0 0a2 2 0 0 0 2 2h14',
  cap: 'M2 9l10-5 10 5-10 5-10-5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5',
  doc: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6',
  maths: 'M5 7h6M8 4v6M14 8h6M5 17l6 0M14 15l5 5M19 15l-5 5',
  pc: 'M9 3h6M10 3v6L5 19a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-10V3M8 15h8',
  svt: 'M5 19C5 10 10 5 20 4c0 10-5 15-14 15zM5 19l8-8',
  download: 'M12 4v11m0 0l-4-4m4 4l4-4M5 20h14',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
  chevron: 'M9 6l6 6-6 6',
}
export function Icon({ n, className = 'h-5 w-5' }: { n: string; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d={P[n] ?? P.doc} /></svg>
}
export const subjectTone: Record<string, string> = {
  maths: 'bg-brand-soft text-brand', pc: 'bg-gold-soft text-gold-dark', svt: 'bg-sand text-ink',
}

export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav className="-mx-4 mb-5 flex items-center gap-1 overflow-x-auto whitespace-nowrap px-4 text-sm text-stone sm:mx-0 sm:px-0" aria-label="Fil d'Ariane">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {it.href ? <Link href={it.href} className="rounded-md px-1 hover:text-brand hover:underline">{it.label}</Link> : <span className="px-1 font-semibold text-ink">{it.label}</span>}
          {i < items.length - 1 && <Icon n="chevron" className="h-3.5 w-3.5 text-gold" />}
        </span>
      ))}
    </nav>
  )
}
export function Title({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mb-7">
      <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{children}</h1>
      <div className="mt-3 h-1 w-12 rounded-full bg-gold" />
      {sub && <p className="mt-3 max-w-prose text-stone">{sub}</p>}
    </div>
  )
}
export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gold/60 bg-white/60 px-6 py-10 text-center text-stone">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-soft text-gold-dark"><Icon n="doc" /></span>
      <p className="max-w-sm text-sm">{children}</p>
    </div>
  )
}
export function fmtSize(n: number | null) { return n ? (n > 1048576 ? (n / 1048576).toFixed(1) + ' Mo' : Math.max(1, Math.round(n / 1024)) + ' Ko') : '' }
