'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin, getCurrentAppRole, adminLogout } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('')
    try {
      await adminLogin(email.trim(), password)
      if (!(await getCurrentAppRole())) { await adminLogout(); throw new Error('Ce compte n’a pas accès à l’espace admin.') }
      router.replace('/admin')
    } catch (x: any) { setErr(x.message?.includes('Invalid login') ? 'Email ou mot de passe incorrect.' : x.message || 'Connexion impossible.') }
    setBusy(false)
  }
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-4 text-2xl font-bold">Espace prof</h1>
      <form onSubmit={submit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
        <label className="block text-sm font-medium">Email<input className="input mt-1" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label className="block text-sm font-medium">Mot de passe<input className="input mt-1" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
        {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
        <button className="btn w-full" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'}</button>
      </form>
    </div>
  )
}
