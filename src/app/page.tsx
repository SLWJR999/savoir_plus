import Link from 'next/link'
const main = [
  { href: '/niveau/college', t: 'Collège', d: '6ème, 5ème, 4ème, 3ème' },
  { href: '/niveau/lycee', t: 'Lycée', d: 'Seconde, Première, Terminale' },
]
const exams = [
  { href: '/annales/bfem', t: 'Annales BFEM', d: 'Sujets des années précédentes' },
  { href: '/annales/bac', t: 'Annales BAC', d: 'Sujets et corrigés par série' },
]
export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight">Retrouve tes exercices, télécharge-les en PDF.</h1>
      <p className="mt-2 text-slate-600">Choisis ton niveau, ta classe et ta matière. Pas besoin de compte.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {main.map(c => (
          <Link key={c.href} href={c.href} className="rounded-2xl bg-brand p-6 text-white shadow hover:bg-emerald-800">
            <span className="block text-2xl font-bold">{c.t}</span><span className="text-sm text-emerald-100">{c.d}</span>
          </Link>
        ))}
      </div>
      <h2 className="mb-3 mt-8 text-lg font-bold">Préparer un examen</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {exams.map(c => (
          <Link key={c.href} href={c.href} className="tile"><span className="block text-lg">{c.t}</span><span className="text-sm font-normal text-slate-600">{c.d}</span></Link>
        ))}
      </div>
    </div>
  )
}
