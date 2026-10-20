'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from './ui'
const items = [
  { href: '/', t: 'Accueil', i: 'home' }, { href: '/niveau/college', t: 'Collège', i: 'book' },
  { href: '/niveau/lycee', t: 'Lycée', i: 'cap' }, { href: '/annales/bfem', t: 'BFEM', i: 'doc' }, { href: '/annales/bac', t: 'BAC', i: 'doc' },
]
const on = (p: string, h: string) => (h === '/' ? p === '/' : p.startsWith(h.split('/').slice(0, 3).join('/')))
export function DesktopNav() {
  const p = usePathname()
  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation">
      {items.slice(1).map(x => <Link key={x.href} href={x.href} className={`rounded-lg px-3 py-2 text-sm font-semibold ${on(p, x.href) ? 'bg-brand-soft text-brand' : 'text-ink hover:bg-paper'}`}>{x.t}</Link>)}
    </nav>
  )
}
export function TabBar() {
  const p = usePathname()
  if (p.startsWith('/admin')) return null
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-sand bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label="Navigation">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map(x => { const a = on(p, x.href); return (
          <li key={x.href}><Link href={x.href} className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${a ? 'text-brand' : 'text-stone'}`}>
            <span className={`h-0.5 w-6 rounded-full ${a ? 'bg-gold' : 'bg-transparent'}`} /><Icon n={x.i} className="h-5 w-5" />{x.t}</Link></li>
        ) })}
      </ul>
    </nav>
  )
}
