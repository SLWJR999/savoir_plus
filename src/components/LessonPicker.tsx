'use client'
import { useEffect, useState } from 'react'
import { getLessons, getSubjectsForProgram, type Subject } from '@/lib/supabase'
import { getAllPrograms, type LessonRow } from '@/lib/data'

export type Sel = { programId: string; subjectSlug: string; lessonId: string; lessons: LessonRow[] }
type Prog = Awaited<ReturnType<typeof getAllPrograms>>

export default function LessonPicker({ onChange, version = 0 }: { onChange: (s: Sel) => void; version?: number }) {
  const [programs, setPrograms] = useState<Prog>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [lessons, setLessons] = useState<LessonRow[]>([])
  const [programId, setProgramId] = useState('')
  const [subjectSlug, setSubjectSlug] = useState('')
  const [lessonId, setLessonId] = useState('')

  useEffect(() => { getAllPrograms().then(p => { setPrograms(p); if (p[0]) setProgramId(p[0].id) }) }, [])
  useEffect(() => {
    if (!programId) return
    getSubjectsForProgram(programId).then(s => { setSubjects(s); setSubjectSlug(cur => s.some(x => x.slug === cur) ? cur : s[0]?.slug ?? '') })
  }, [programId])
  useEffect(() => {
    if (!programId || !subjectSlug) { setLessons([]); return }
    getLessons(programId, subjectSlug).then(r => { setLessons(r.lessons); setLessonId(cur => r.lessons.some(l => l.id === cur) ? cur : r.lessons[0]?.id ?? '') }).catch(() => setLessons([]))
  }, [programId, subjectSlug, version])
  useEffect(() => { onChange({ programId, subjectSlug, lessonId, lessons }) }, [programId, subjectSlug, lessonId, lessons, onChange])

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="text-sm font-medium">Classe
        <select className="input mt-1" value={programId} onChange={e => setProgramId(e.target.value)}>{programs.map(p => <option key={p.id} value={p.id}>{p.display_name}</option>)}</select>
      </label>
      <label className="text-sm font-medium">Matière
        <select className="input mt-1" value={subjectSlug} onChange={e => setSubjectSlug(e.target.value)}>{subjects.map(s => <option key={s.id} value={s.slug}>{s.name}</option>)}</select>
      </label>
      <label className="text-sm font-medium">Leçon
        <select className="input mt-1" value={lessonId} onChange={e => setLessonId(e.target.value)}>
          {!lessons.length && <option value="">Aucune leçon</option>}
          {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
        </select>
      </label>
    </div>
  )
}
