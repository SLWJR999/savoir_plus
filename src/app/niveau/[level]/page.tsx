import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getGradesByLevel, getClassPrograms } from '@/lib/supabase'
import { Crumbs, Title, Empty } from '@/components/ui'
export const revalidate = 60
export function generateStaticParams() { return [{ level: 'college' }, { level: 'lycee' }] }

export default async function Page({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params
  const grades = await getGradesByLevel(level)
  if (!grades.length) notFound()
  const groups = await Promise.all(grades.map(async g => ({ g, programs: await getClassPrograms(g.slug) })))
  const title = level === 'college' ? 'Collège' : 'Lycée'
  return (
    <div>
      <Crumbs items={[{ href: '/', label: 'Accueil' }, { label: title }]} />
      <Title sub="Choisis ta classe">{title}</Title>
      <div className="space-y-6">
        {groups.map(({ g, programs }) => {
          if (!programs.length) return null
          const single = programs.length === 1 && !programs[0].series
          return single ? (
            <Link key={g.id} href={`/parcours/${programs[0].slug}`} className="tile">{g.name}</Link>
          ) : (
            <section key={g.id}>
              <h2 className="mb-2 font-bold">{g.name}</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {programs.map(p => <Link key={p.id} href={`/parcours/${p.slug}`} className="tile text-center">{p.series?.name ?? p.display_name}</Link>)}
              </div>
            </section>
          )
        })}
        {groups.every(x => !x.programs.length) && <Empty>Aucune classe disponible pour le moment.</Empty>}
      </div>
    </div>
  )
}
