import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLessons } from '@/lib/supabase'
import { getProgramBySlug } from '@/lib/data'
import { Crumbs, Title, Empty } from '@/components/ui'
export const revalidate = 60

export default async function Page({ params }: { params: Promise<{ slug: string; matiere: string }> }) {
  const { slug, matiere } = await params
  const p = await getProgramBySlug(slug)
  if (!p) notFound()
  const { subject, lessons } = await getLessons(p.id, matiere).catch(() => notFound())
  return (
    <div>
      <Crumbs items={[{ href: '/', label: 'Accueil' }, { href: `/niveau/${p.grades.levels.slug}`, label: p.grades.levels.name }, { href: `/parcours/${slug}`, label: p.display_name }, { label: subject.name }]} />
      <Title sub={`${p.display_name} · ${lessons.length} leçon${lessons.length > 1 ? 's' : ''}`}>{subject.name}</Title>
      {lessons.length ? (
        <ul className="space-y-2">
          {lessons.map(l => (
            <li key={l.id}>
              <Link href={`/lecon/${l.id}`} className="tile flex items-center justify-between gap-3">
                <span>{l.title}</span>
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{l.exercises_count} PDF</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : <Empty>Aucune leçon pour le moment.</Empty>}
    </div>
  )
}
