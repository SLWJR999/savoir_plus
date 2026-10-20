'use client'
import { useCallback, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { deleteLessonCompletely, getSubjects } from '@/lib/data'
import LessonPicker, { type Sel } from '@/components/LessonPicker'
import { useRole } from '@/components/AdminGate'
import { Empty } from '@/components/ui'

export default function Page() {
  const role = useRole()
  const [sel, setSel] = useState<Sel>({ programId: '', subjectSlug: '', lessonId: '', lessons: [] })
  const onSel = useCallback((s: Sel) => setSel(s), [])
  const [version, setVersion] = useState(0)
  const [title, setTitle] = useState('')
  const [err, setErr] = useState('')

  if (role !== 'developpeur') return <Empty>Cette page est réservée au développeur.</Empty>
  const run = async (fn: () => Promise<void>) => { try { setErr(''); await fn(); setVersion(v => v + 1) } catch (e: any) { setErr(e.message) } }

  const add = () => run(async () => {
    if (!title.trim() || !sel.programId) return
    const subj = (await getSubjects()).find(s => s.slug === sel.subjectSlug)
    if (!subj) throw new Error('Matière introuvable.')
    const pos = sel.lessons.reduce((m, l) => Math.max(m, l.position), 0) + 1
    const { error } = await supabase.from('lessons').insert({ program_id: sel.programId, subject_id: subj.id, title: title.trim(), position: pos })
    if (error) throw new Error(error.code === '23505' ? 'Cette leçon existe déjà.' : error.message)
    setTitle('')
  })

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Catalogue des leçons</h1>
      <LessonPicker onChange={onSel} version={version} />
      <div className="flex gap-2">
        <input className="input" placeholder="Titre de la nouvelle leçon" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
        <button className="btn shrink-0" onClick={add}>Ajouter</button>
      </div>
      {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
      {sel.lessons.length ? (
        <ul className="space-y-2">
          {sel.lessons.map(l => (
            <li key={l.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3">
              <span className="min-w-0 break-words">{l.position}. {l.title} <span className="text-xs text-slate-500">({l.exercises_count} PDF)</span></span>
              <div className="flex shrink-0 gap-2">
                <button className="btn-ghost !px-3 !py-1.5 !text-xs" onClick={() => { const t = window.prompt('Nouveau titre', l.title); if (t?.trim()) run(async () => { const { error } = await supabase.from('lessons').update({ title: t.trim(), updated_at: new Date().toISOString() }).eq('id', l.id); if (error) throw error }) }}>Renommer</button>
                <button className="btn-danger" onClick={() => { if (confirm(`Supprimer « ${l.title} » et ses ${l.exercises_count} PDF ?`)) run(() => deleteLessonCompletely(l.id)) }}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      ) : <Empty>Aucune leçon pour cette matière.</Empty>}
    </div>
  )
}
