import Link from 'next/link'
import { Icon } from '@/components/ui'

const levels = [
  { href: '/niveau/college', t: 'Collège', d: ['6ème', '5ème', '4ème', '3ème'], cls: 'bg-brand text-white', chip: 'bg-white/15 text-white', arrow: 'bg-white text-brand' },
  { href: '/niveau/lycee', t: 'Lycée', d: ['Seconde', 'Première', 'Terminale'], cls: 'bg-ink text-white', chip: 'bg-white/10 text-gold-soft', arrow: 'bg-gold text-ink' },
]
const exams = [
  { href: '/annales/bfem', t: 'Annales BFEM', d: 'Les sujets des années précédentes pour préparer le brevet.' },
  { href: '/annales/bac', t: 'Annales BAC', d: 'Sujets et corrigés, classés par année et par matière.' },
]
const steps = ['Choisis ta classe', 'Ouvre ta matière', 'Télécharge le PDF']

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <span className="chip">Gratuit, sans inscription</span>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">Tous tes exercices et annales en PDF, au même endroit.</h1>
          <p className="mt-4 max-w-md text-lg text-stone">Choisis ta classe et ta matière, télécharge, puis révise où tu veux, même depuis ton téléphone.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/niveau/college" className="btn !px-5 !py-3 !text-base">Je suis au collège</Link>
            <Link href="/niveau/lycee" className="btn-ghost !px-5 !py-3 !text-base">Je suis au lycée</Link>
          </div>
        </div>
        <div className="mx-auto w-48 sm:w-60 md:w-full md:max-w-xs" aria-hidden="true">
          <svg viewBox="0 0 220 220" className="h-auto w-full">
            <path d="M92 32h40v60h60v40h-60v60H92v-60H32V92h60z" transform="translate(14 14)" fill="none" stroke="#B98F3F" strokeWidth="3" />
            <path d="M92 32h40v60h60v40h-60v60H92v-60H32V92h60z" fill="#B3202A" />
            <path d="M104 52v48h-48" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="3" />
          </svg>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Choisis ton niveau</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {levels.map(l => (
            <Link key={l.href} href={l.href} className={`group flex min-h-[11rem] flex-col justify-between rounded-3xl p-6 shadow-sm ${l.cls}`}>
              <div className="flex items-start justify-between">
                <span className="font-display text-3xl font-extrabold">{l.t}</span>
                <span className={`grid h-10 w-10 place-items-center rounded-full ${l.arrow}`}><Icon n="chevron" /></span>
              </div>
              <div className="flex flex-wrap gap-2">{l.d.map(g => <span key={g} className={`rounded-full px-3 py-1 text-sm font-semibold ${l.chip}`}>{g}</span>)}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-sand/60 p-5 sm:p-8">
        <h2 className="mb-1 text-2xl font-bold">Préparer un examen</h2>
        <p className="mb-5 text-stone">Entraîne-toi sur les vrais sujets.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {exams.map(e => (
            <Link key={e.href} href={e.href} className="tile flex items-start gap-4 !p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-dark"><Icon n="doc" className="h-6 w-6" /></span>
              <span className="flex-1"><span className="block font-display text-lg font-bold">{e.t}</span><span className="mt-1 block text-sm font-normal text-stone">{e.d}</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Comment ça marche</h2>
        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3 rounded-2xl border border-sand bg-white p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold font-display font-extrabold text-white">{i + 1}</span>
              <span className="font-semibold">{s}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
