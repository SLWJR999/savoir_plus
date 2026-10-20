import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSubjects } from '@/lib/data'
import { Crumbs, Title, subjectTone } from '@/components/ui'

export const revalidate = 60
export function generateStaticParams() { return [{ exam: 'bfem' }, { exam: 'bac' }] }

export default async function Page({ params }: { params: Promise<{ exam: string }> }) {
  const { exam } = await params
  if (exam !== 'bfem' && exam !== 'bac') notFound()
  const subjects = await getSubjects()
  const name = exam.toUpperCase()
  return (
    <div>
      <Crumbs items={[{ href: '/', label: 'Accueil' }, { label: `Annales ${name}` }]} />
      <Title sub="Choisis une matière pour voir les sujets des années précédentes">{`Annales ${name}`}</Title>
      <div className="grid gap-3 sm:grid-cols-3">
        {subjects.map(s => <Link key={s.id} href={`/annales/${exam}/${s.slug}`} className={`tile border-l-4 ${subjectTone[s.slug] ?? 'border-l-brand'}`}>{s.name}</Link>)}
      </div>
    </div>
  )
}