'use client'
import { useCallback, useEffect, useState } from 'react'
import { deleteExamPaper, getExamSessions, getSeriesByLevel, supabase, updateExamPaper, uploadExamPaper, type ExamPaper, type Series, type Subject } from '@/lib/supabase'
import { getSubjects } from '@/lib/data'
import Dropzone from '@/components/Dropzone'
import { Empty, fmtSize } from '@/components/ui'

type Row = ExamPaper & { subjects: { name: string } | null; series: { name: string } | null }
type Sess = Awaited<ReturnType<typeof getExamSessions>>[number]
const kinds = [['sujet', 'Sujet'], ['corrige', 'Corrigé'], ['bareme', 'Barème'], ['autre', 'Autre']] as const

export default function Page() {
  const [exam, setExam] = useState<'bfem' | 'bac'>('bfem')
  const [sessions, setSessions] = useState<Sess[]>([])
  const [sessionId, setSessionId] = useState('')
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [series, setSeries] = useState<Series[]>([])
  const [subjectId, setSubjectId] = useState(0)
  const [seriesId, setSeriesId] = useState<number | null>(null)
  const [kind, setKind] = useState<ExamPaper['paper_kind']>('sujet')
  const [year, setYear] = useState(new Date().getFullYear())
  const [label, setLabel] = useState('Session normale')
  const [rows, setRows] = useState<Row[]>([])
  const [log, setLog] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => { getSubjects().then(s => { setSubjects(s); setSubjectId(s[0]?.id ?? 0) }); getSeriesByLevel('lycee').then(s => setSeries(s.filter(x => !x.slug.startsWith('seconde')))) }, [])
  const loadSessions = useCallback(async () => {
    const s = await getExamSessions(exam); setSessions(s); setSessionId(cur => s.some(x => x.id === cur) ? cur : s[0]?.id ?? '')
  }, [exam])
  useEffect(() => { loadSessions().catch(e => setErr(e.message)) }, [loadSessions])
  const loadRows = useCallback(async () => {
    if (!sessionId) return setRows([])
    const { data, error } = await supabase.from('exam_papers').select('*, subjects(name), series(name)').eq('session_id', sessionId).order('created_at', { ascending: false })
    if (error) setErr(error.message); else setRows(data as unknown as Row[])
  }, [sessionId])
  useEffect(() => { loadRows() }, [loadRows])

  const run = async (fn: () => Promise<void>) => { try { setErr(''); await fn() } catch (e: any) { setErr(e.message) } }
  const createSession = () => run(async () => {
    const { data, error } = await supabase.from('exam_types').select('id').eq('slug', exam).single()
    if (error) throw error
    const r = await supabase.from('exam_sessions').insert({ exam_type_id: data.id, year, session_label: label.trim() || 'Session normale' }).select('id').single()
    if (r.error) throw new Error(r.error.code === '23505' ? 'Cette session existe déjà.' : r.error.message)
    await loadSessions(); setSessionId(r.data.id)
  })
  async function upload(files: File[]) {
    if (!sessionId || !subjectId) return setErr('Choisis une session et une matière.')
    setBusy(true); setErr(''); setLog([])
    for (const f of files) {
      try {
        await uploadExamPaper({ sessionId, subjectId, seriesId: exam === 'bac' ? seriesId : null, paperKind: kind, title: f.name.replace(/\.pdf$/i, ''), file: f })
        setLog(l => [...l, `${f.name} — terminé`])
      } catch (e: any) { setLog(l => [...l, `${f.name} — erreur : ${e.message}`]) }
    }
    setBusy(false); loadRows()
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Annales</h1>
      <div className="flex gap-2">{(['bfem', 'bac'] as const).map(x => <button key={x} onClick={() => setExam(x)} className={x === exam ? 'btn' : 'btn-ghost'}>{x.toUpperCase()}</button>)}</div>
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
        <label className="text-sm font-medium sm:col-span-2">Session
          <select className="input mt-1" value={sessionId} onChange={e => setSessionId(e.target.value)}>
            {!sessions.length && <option value="">Aucune session</option>}
            {sessions.map(s => <option key={s.id} value={s.id}>{s.year} — {s.session_label}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">Nouvelle année<input className="input mt-1" type="number" min={1950} max={2100} value={year} onChange={e => setYear(+e.target.value)} /></label>
        <label className="text-sm font-medium">Session<input className="input mt-1" value={label} onChange={e => setLabel(e.target.value)} /></label>
        <button className="btn sm:col-span-4" onClick={createSession}>Créer cette session</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-sm font-medium">Matière<select className="input mt-1" value={subjectId} onChange={e => setSubjectId(+e.target.value)}>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
        <label className="text-sm font-medium">Type<select className="input mt-1" value={kind} onChange={e => setKind(e.target.value as ExamPaper['paper_kind'])}>{kinds.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label>
        {exam === 'bac' && <label className="text-sm font-medium">Série<select className="input mt-1" value={seriesId ?? ''} onChange={e => setSeriesId(e.target.value ? +e.target.value : null)}><option value="">Commune à toutes les séries</option>{series.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>}
      </div>
      <Dropzone onFiles={upload} disabled={busy || !sessionId} />
      {log.length > 0 && <ul className="space-y-1 text-sm">{log.map((l, i) => <li key={i} className={l.includes('erreur') ? 'text-red-700' : ''}>{l}</li>)}</ul>}
      {err && <p role="alert" className="text-sm text-red-700">{err}</p>}
      <h2 className="font-bold">Documents de cette session ({rows.length})</h2>
      {rows.length ? (
        <ul className="space-y-2">
          {rows.map(r => (
            <li key={r.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0"><p className="break-words font-medium">{r.title}</p><p className="text-xs text-slate-500">{r.subjects?.name} · {kinds.find(k => k[0] === r.paper_kind)?.[1]}{r.series ? ' · ' + r.series.name : ''} {fmtSize(r.file_size_bytes) && '· ' + fmtSize(r.file_size_bytes)}</p></div>
              <div className="flex shrink-0 gap-2">
                <button className="btn-ghost !px-3 !py-1.5 !text-xs" onClick={() => { const t = window.prompt('Nouveau titre', r.title); if (t?.trim()) run(async () => { await updateExamPaper(r.id, { title: t.trim() }); await loadRows() }) }}>Renommer</button>
                <button className="btn-danger" onClick={() => { if (confirm(`Supprimer « ${r.title} » ?`)) run(async () => { await deleteExamPaper(r); await loadRows() }) }}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      ) : <Empty>Aucun document dans cette session.</Empty>}
    </div>
  )
}
