'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { adminLogout, getCurrentAppRole, supabase, type AppRole } from '@/lib/supabase'

const RoleCtx = createContext<AppRole>(null)
export const useRole = () => useContext(RoleCtx)

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const router = useRouter()
  const [role, setRole] = useState<AppRole | undefined>(undefined)
  const isLogin = path === '/admin/login'

  useEffect(() => {
    if (isLogin) return
    let alive = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      const r = data.session ? await getCurrentAppRole().catch(() => null) : null
      if (!alive) return
      if (!r) router.replace('/admin/login')
      else setRole(r)
    })()
    const { data: sub } = supabase.auth.onAuthStateChange(ev => { if (ev === 'SIGNED_OUT') router.replace('/admin/login') })
    return () => { alive = false; sub.subscription.unsubscribe() }
  }, [isLogin, router])

  if (isLogin) return <>{children}</>
  if (!role) return <p className="py-10 text-center text-sm text-slate-500">Vérification de l’accès…</p>

  const links = [{ href: '/admin/exercices', t: 'Exercices' }, { href: '/admin/annales', t: 'Annales' }, ...(role === 'developpeur' ? [{ href: '/admin/catalogue', t: 'Catalogue' }] : [])]
  return (
    <RoleCtx.Provider value={role}>
      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <Link href="/admin" className="mr-2 font-bold">Admin</Link>
        {links.map(l => <Link key={l.href} href={l.href} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${path.startsWith(l.href) ? 'bg-brand text-white' : 'bg-white text-ink hover:bg-slate-100'}`}>{l.t}</Link>)}
        <button className="btn-ghost ml-auto !py-1.5" onClick={async () => { await adminLogout(); router.replace('/admin/login') }}>Se déconnecter</button>
      </div>
      {children}
    </RoleCtx.Provider>
  )
}
