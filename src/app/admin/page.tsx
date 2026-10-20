'use client'
import Link from 'next/link'
import { useRole } from '@/components/AdminGate'
export default function Admin() {
  const role = useRole()
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Bonjour{role === 'professeur' ? ' professeur' : ''}</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/admin/exercices" className="tile">Ajouter des exercices<span className="block text-sm font-normal text-slate-600">Dépose des PDF dans une leçon</span></Link>
        <Link href="/admin/annales" className="tile">Ajouter des annales BFEM / BAC<span className="block text-sm font-normal text-slate-600">Sujets et corrigés par année</span></Link>
        {role === 'developpeur' && <Link href="/admin/catalogue" className="tile">Catalogue des leçons<span className="block text-sm font-normal text-slate-600">Ajouter, renommer, supprimer des leçons</span></Link>}
      </div>
    </div>
  )
}
