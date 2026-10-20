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
          
          <div className="mt-6">
            <a href="#niveaux" className="btn inline-flex !px-6 !py-3 !text-base">Choisir ma classe</a>
          </div>
        </div>
        
        {/* Nouvelle illustration : Documents et livre ouvert */}
        <div className="mx-auto mt-6 w-32 sm:w-48 md:mt-0 md:w-full md:max-w-[18rem]" aria-hidden="true">
          <svg viewBox="0 0 200 200" className="h-auto w-full drop-shadow-md">
            {/* Document arrière-plan */}
            <rect x="40" y="30" width="100" height="120" rx="8" fill="#B98F3F" opacity="0.2" transform="rotate(-10 90 90)" />
            {/* Document principal */}
            <rect x="55" y="45" width="110" height="130" rx="8" fill="#fff" stroke="#e5e5e5" strokeWidth="2" />
            <path d="M 75 70 H 140 M 75 90 H 120 M 75 110 H 135" stroke="#d4d4d4" strokeWidth="4" strokeLinecap="round" />
            {/* Étiquette PDF rouge */}
            <rect x="65" y="135" width="40" height="20" rx="4" fill="#B3202A" />
            <text x="85" y="149" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle">PDF</text>
            
            {/* Livre ouvert au premier plan */}
            <path d="M 90 160 L 40 180 L 40 155 L 90 135 Z" fill="#B3202A" />
            <path d="M 90 160 L 140 180 L 140 155 L 90 135 Z" fill="#8A1820" />
            <path d="M 90 135 V 160" stroke="#fff" strokeWidth="2" />
            {/* Lignes du livre */}
            <path d="M 55 165 H 80 M 100 165 H 125" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      <section id="niveaux">
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