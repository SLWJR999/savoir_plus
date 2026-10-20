import { notFound } from 'next/navigation'
import { getExamPapers } from '@/lib/supabase'
import { Crumbs, Title, Empty } from '@/components/ui'
import PdfRow from '@/components/PdfRow'
export const revalidate = 60

const kinds: Record<string, string> = { sujet: 'Sujet', corrige: 'Corrigé', bareme: 'Barème', autre: 'Autre' }

export default async function Page({ params }: { params: Promise<{ exam: string; matiere: string }> }) {
  const { exam, matiere } = await params
  if (exam !== 'bfem' && exam !== 'bac') notFound()
  const papers = await getExamPapers({ examSlug: exam, subjectSlug: matiere })
  const name = exam.toUpperCase()
  const groups = new Map<string, { year: number; label: string; items: typeof papers }>()
  for (const p of papers) {
    const k = `${p.exam_sessions.year}|${p.exam_sessions.session_label}`
    if (!groups.has(k)) groups.set(k, { year: p.exam_sessions.year, label: p.exam_sessions.session_label, items: [] })
    groups.get(k)!.items.push(p)
  }
  const list = [...groups.values()].sort((a, b) => b.year - a.year || a.label.localeCompare(b.label))
  return (
    <div>
      <Crumbs items={[{ href: '/', label: 'Accueil' }, { href: `/annales/${exam}`, label: `Annales ${name}` }, { label: papers[0]?.subjects.name ?? matiere }]} />
      <Title>{`${name} · ${papers[0]?.subjects.name ?? matiere}`}</Title>
      {list.length ? (
        <div className="space-y-6">
          {list.map(g => (
            <section key={g.year + g.label}>
              <h2 className="mb-2 font-bold">{g.year} <span className="text-sm font-normal text-slate-500">{g.label}</span></h2>
              <ul className="space-y-3">
                {g.items.map(p => <PdfRow key={p.id} title={p.title} path={p.file_path} size={p.file_size_bytes} badges={[kinds[p.paper_kind], ...(p.series ? [p.series.name] : [])]} />)}
              </ul>
            </section>
          ))}
        </div>
      ) : <Empty>Aucun sujet disponible pour cette matière pour le moment.</Empty>}
    </div>
  )
}
