import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSubjectsForProgram } from '@/lib/supabase'
import { getProgramBySlug, getProgramSlugs } from '@/lib/data'
import { Crumbs, Title, Empty, subjectColor } from '@/components/ui'
export const revalidate = 60
export async function generateStaticParams() { return (await getProgramSlugs()).map(slug => ({ slug })) }

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = await getProgramBySlug(slug)
  if (!p) notFound()
  const subjects = await getSubjectsForProgram(p.id)
  return (
    <div>
      <Crumbs items={[{ href: '/', label: 'Accueil' }, { href: `/niveau/${p.grades.levels.slug}`, label: p.grades.levels.name }, { label: p.display_name }]} />
      <Title sub="Choisis une matière">{p.display_name}</Title>
      {subjects.length ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {subjects.map(s => <Link key={s.id} href={`/parcours/${slug}/${s.slug}`} className={`tile border-l-4 ${subjectColor[s.slug] ?? 'border-l-brand'}`}>{s.name}</Link>)}
        </div>
      ) : <Empty>Aucune matière pour cette classe.</Empty>}
    </div>
  )
}
