'use client'
import { useCallback, useEffect, useState } from 'react'
import { deleteExercise, getLessonWithExercises, updateExercise, uploadExercise, type Exercise } from '@/lib/supabase'
import LessonPicker, { type Sel } from '@/components/LessonPicker'
import Dropzone from '@/components/Dropzone'
import { Empty, fmtSize } from '@/components/ui'

const kinds = [['exercice', 'Exercices'], ['corrige', 'Corrigé'], ['devoir', 'Devoir'], ['fiche', 'Fiche']] as const

export default function Page() {
  const [sel, setSel] = useState<Sel>({ programId: '', subjectSlug: '', lessonId: '', lessons: [] })
  const onSel = useCallback((s: Sel) => setSel(s), [])
  const [items, setItems] = useState<Exercise[]>([])
  const [kind, setKind] = useState<Exercise['document_kind']>('exercice')
  const [withCorr, setWithCorr] = useState(false)
  const [log, setLog] = useState<{ name: string; state: string }[]>([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    if (!sel.lessonId) return setItems([])
    try { setItems((await getLessonWithExercises(sel.lessonId)).exercises) } catch (e: any) { setErr(e.message) }
  }, [sel.lessonId])
  useEffect(() => { load() }, [load])

  async function upload(files: File[]) {
    if (!sel.lessonId) return setErr('Choisis d’abord une leçon.')
    setBusy(true); setErr(''); setLog(files.map(f => ({ name: f.name, state: 'En attente' })))
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      setLog(l => l.map((x, j) => j === i ? { ...x, state: 'Envoi…' } : x))
      try {
        await uploadExercise({ lessonId: sel.lessonId, file: f, title: f.name.replace(/\.pdf$/i, ''), documentKind: kind, hasCorrection: withCorr })
        setLog(l => l.map((x, j) => j === i ? { ...x, state: 'Terminé' } : x))
      } catch (e: any) { setLog(l => l.map((x, j) => j === i ? { ...x, state: 'Erreur : ' + (e.message ?? 'échec') } : x)) }
    }
    setBusy(false); load()
  }
  const run = async (fn: () => Promise<void>) => { try { setErr(''); await fn(); await load() } catch (e: any) { setErr(e.message) } }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Exercices</h1>
      <LessonPicker onChange={onSel} />
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <label className="text-sm font-medium">Type de document
          <select className="input mt-1" value={kind} onChange={e => setKind(e.target.value as Exercise['document_kind'])}>{kinds.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select>
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={withCorr} onChange={e => setWithCorr(e.target.checked)} /> Ce document a un corrigé</label>
      </div>
      <Dropzone onFiles={upload} disabled={busy || !sel.lessonId} />
      {log.length > 0 && <ul className="space-y-1 text-sm">{log.map((l, i) => <li key={i} className={l.state.startsWith('Erreur') ? 'text-red-700' : ''}>{l.name} — {l.state}</li>)}</ul>}
      {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
      <h2 className="font-bold">Documents de cette leçon ({items.length})</h2>
      {items.length ? (
        <ul className="space-y-2">
          {items.map(e => (
            <li key={e.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0"><p className="break-words font-medium">{e.title}</p><p className="text-xs text-slate-500">{kinds.find(k => k[0] === e.document_kind)?.[1]} {fmtSize(e.file_size_bytes) && '· ' + fmtSize(e.file_size_bytes)}{e.has_correction && ' · avec corrigé'}</p></div>
              <div className="flex shrink-0 gap-2">
                <button className="btn-ghost !px-3 !py-1.5 !text-xs" onClick={() => { const t = window.prompt('Nouveau titre', e.title); if (t?.trim()) run(() => updateExercise(e.id, { title: t.trim() })) }}>Renommer</button>
                <button className="btn-danger" onClick={() => { if (confirm(`Supprimer « ${e.title} » ?`)) run(() => deleteExercise(e)) }}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      ) : <Empty>Aucun document dans cette leçon.</Empty>}
    </div>
  )
}
