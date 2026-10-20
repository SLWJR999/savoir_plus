import { notFound } from 'next/navigation'
import { getLessonWithExercises } from '@/lib/supabase'
import { Crumbs, Title, Empty } from '@/components/ui'
import PdfRow from '@/components/PdfRow'
import RefreshButton from '@/components/RefreshButton' // 👈 Import du bouton

export const revalidate = 30

const kinds: Record<string, string> = { exercice: 'Exercices', corrige: 'Corrigé', devoir: 'Devoir', fiche: 'Fiche' }

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  const r = await getLessonWithExercises(id) 
  if (!r) notFound()
  const { lesson, exercises } = r as any
  const prog = lesson.class_programs, subj = lesson.subjects
  
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <Crumbs items={[{ href: '/', label: 'Accueil' }, { href: `/parcours/${prog.slug}`, label: prog.display_name }, { href: `/parcours/${prog.slug}/${subj.slug}`, label: subj.name }, { label: lesson.title }]} />
        {/* 👈 On place le bouton ici */}
        <RefreshButton />
      </div>
      
      <Title sub={`${prog.display_name} · ${subj.name}`}>{lesson.title}</Title>
      
      {lesson.description && <p className="mb-4 text-sm text-slate-600">{lesson.description}</p>}
      
      {exercises.length ? (
        <ul className="space-y-3">
          {exercises.map((e: any) => (
            <PdfRow key={e.id} title={e.title} path={e.file_path} size={e.file_size_bytes}
              badges={[kinds[e.document_kind], ...(e.has_correction && e.document_kind !== 'corrige' ? ['Avec corrigé'] : [])]} />
          ))}
        </ul>
      ) : <Empty>Cette leçon n’a pas encore d’exercices. Reviens plus tard, ils seront bientôt disponibles !</Empty>}
    </div>
  )
}