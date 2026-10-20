// lib/supabase.ts — compatible avec le schéma Supabase (01_schema + 02_seed)
// Ne jamais mettre la clé service_role dans le navigateur.

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !anonKey) throw new Error('Variables Supabase manquantes dans .env.local')

export const supabase = createClient(url, anonKey)
const BUCKET = 'documents-scolaires'
const MAX_PDF_BYTES = 20 * 1024 * 1024

export type Level = { id: number; slug: string; name: string; position: number }
export type Grade = { id: number; level_id: number; slug: string; name: string; position: number }
export type Series = { id: number; slug: string; name: string; level_id: number; position: number; active: boolean }
export type ClassProgram = { id: string; slug: string; grade_id: number; series_id: number | null; display_name: string; position: number; active: boolean }
export type Subject = { id: number; slug: string; name: string; position: number; active: boolean }
export type Lesson = { id: string; program_id: string; subject_id: number; title: string; description: string | null; position: number; active: boolean; created_at: string; updated_at: string }
export type Exercise = { id: string; lesson_id: string; title: string; description: string | null; document_kind: 'exercice' | 'corrige' | 'devoir' | 'fiche'; file_path: string; file_size_bytes: number | null; has_correction: boolean; uploaded_by: string | null; created_at: string; updated_at: string }
export type ExamType = { id: number; slug: 'bfem' | 'bac'; name: string; position: number }
export type ExamSession = { id: string; exam_type_id: number; year: number; session_label: string; notes: string | null; created_at: string }
export type ExamPaper = { id: string; session_id: string; subject_id: number; series_id: number | null; paper_kind: 'sujet' | 'corrige' | 'bareme' | 'autre'; title: string; file_path: string; file_size_bytes: number | null; uploaded_by: string | null; created_at: string; updated_at: string }
export type AppRole = 'professeur' | 'developpeur' | null

function throwIfError<T>(result: { data: T; error: any }): T {
  if (result.error) throw result.error
  return result.data
}

// --------------------------- CATALOGUE PUBLIC ---------------------------
export async function getLevels() {
  return throwIfError(await supabase.from('levels').select('*').order('position')) as Level[]
}

export async function getGradesByLevel(levelSlug: string) {
  const result = await supabase.from('grades').select('*, levels!inner(slug)').eq('levels.slug', levelSlug).order('position')
  return throwIfError(result) as unknown as Grade[]
}

export async function getSeriesByLevel(levelSlug = 'lycee') {
  const result = await supabase.from('series').select('*, levels!inner(slug)').eq('levels.slug', levelSlug).eq('active', true).order('position')
  return throwIfError(result) as unknown as Series[]
}

export async function getClassPrograms(gradeSlug: string) {
  const result = await supabase.from('class_programs').select('*, grades!inner(slug, name, level_id), series(id, slug, name)').eq('grades.slug', gradeSlug).eq('active', true).order('position')
  return throwIfError(result) as unknown as (ClassProgram & { grades: Pick<Grade, 'slug' | 'name' | 'level_id'>; series: Pick<Series, 'id' | 'slug' | 'name'> | null })[]
}

export async function getSubjectsForProgram(programId: string) {
  const result = await supabase.from('program_subjects').select('position, subjects!inner(id, slug, name, position, active)').eq('program_id', programId).eq('subjects.active', true).order('position')
  const rows = throwIfError(result) as unknown as { position: number; subjects: Subject }[]
  return rows.map(row => row.subjects)
}

export async function getLessons(programId: string, subjectSlug: string) {
  const subjectResult = await supabase.from('subjects').select('*').eq('slug', subjectSlug).single()
  const subject = throwIfError(subjectResult) as Subject
  const lessonResult = await supabase.from('lessons_overview').select('*').eq('program_id', programId).eq('subject_id', subject.id).eq('active', true).order('position')
  return { subject, lessons: throwIfError(lessonResult) as (Lesson & { exercises_count: number })[] }
}

export async function getLessonWithExercises(lessonId: string) {
  // Pas de jointure imbriquée : lessons n'a pas de clé étrangère directe vers class_programs/subjects
  // (la FK est composite vers program_subjects), PostgREST ne peut donc pas les relier en une requête.
  const lessonResult = await supabase.from('lessons').select('*').eq('id', lessonId).maybeSingle()
  const lesson = throwIfError(lessonResult) as Lesson | null
  if (!lesson) return null
  const [progResult, subjResult, exResult] = await Promise.all([
    supabase.from('class_programs').select('display_name, slug, grades(name, slug), series(name, slug)').eq('id', lesson.program_id).single(),
    supabase.from('subjects').select('name, slug').eq('id', lesson.subject_id).single(),
    supabase.from('exercises').select('*').eq('lesson_id', lessonId).order('created_at', { ascending: false }),
  ])
  return {
    lesson: { ...lesson, class_programs: throwIfError(progResult), subjects: throwIfError(subjResult) } as any,
    exercises: throwIfError(exResult) as Exercise[],
  }
}

// ------------------------------ ANNALES ---------------------------------
export async function getExamTypes() {
  return throwIfError(await supabase.from('exam_types').select('*').order('position')) as ExamType[]
}

export async function getExamSessions(examSlug: 'bfem' | 'bac') {
  const result = await supabase.from('exam_sessions').select('*, exam_types!inner(slug, name)').eq('exam_types.slug', examSlug).order('year', { ascending: false }).order('session_label')
  return throwIfError(result) as unknown as (ExamSession & { exam_types: Pick<ExamType, 'slug' | 'name'> })[]
}

export async function getExamPapers(params: { examSlug: 'bfem' | 'bac'; subjectSlug: string; year?: number; seriesSlug?: string | null; paperKind?: ExamPaper['paper_kind'] }) {
  const { examSlug, subjectSlug, year, seriesSlug, paperKind } = params
  let query = supabase.from('exam_papers').select('*, exam_sessions!inner(year, session_label, exam_types!inner(slug)), subjects!inner(slug, name), series(id, slug, name)').eq('exam_sessions.exam_types.slug', examSlug).eq('subjects.slug', subjectSlug)
  if (year != null) query = query.eq('exam_sessions.year', year)
  if (paperKind) query = query.eq('paper_kind', paperKind)
  if (seriesSlug) query = query.eq('series.slug', seriesSlug)
  const result = await query.order('created_at', { ascending: false })
  return throwIfError(result) as unknown as (ExamPaper & { exam_sessions: { year: number; session_label: string }; subjects: { slug: string; name: string }; series: { id: number; slug: string; name: string } | null })[]
}

// --------------------------- AUTHENTIFICATION ---------------------------
export async function adminLogin(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}
export async function adminLogout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
export async function getCurrentAppRole(): Promise<AppRole> {
  const { data, error } = await supabase.rpc('current_app_role')
  if (error) throw error
  return (data === 'professeur' || data === 'developpeur') ? data : null
}
export async function isCurrentUserStaff() {
  const { data, error } = await supabase.rpc('is_staff')
  if (error) return false
  return data === true
}
export async function isCurrentUserDeveloper() {
  const { data, error } = await supabase.rpc('is_developer')
  if (error) return false
  return data === true
}

// ------------------------ GESTION DES EXERCICES ------------------------
export async function uploadExercise(params: { lessonId: string; file: File; title: string; description?: string; documentKind?: Exercise['document_kind']; hasCorrection?: boolean }) {
  const { lessonId, file, title, description = '', documentKind = 'exercice', hasCorrection = false } = params
  validatePdf(file)
  const { data: userResult } = await supabase.auth.getUser()
  if (!userResult.user) throw new Error('Connecte-toi avant de déposer un document.')
  const path = `exercices/${lessonId}/${crypto.randomUUID()}.pdf`
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: 'application/pdf', upsert: false })
  if (uploadError) throw uploadError
  const result = await supabase.from('exercises').insert({ lesson_id: lessonId, title, description, document_kind: documentKind, file_path: path, file_size_bytes: file.size, has_correction: hasCorrection, uploaded_by: userResult.user.id }).select().single()
  if (result.error) {
    await supabase.storage.from(BUCKET).remove([path])
    throw result.error
  }
  return result.data as Exercise
}

export async function uploadManyExercises(lessonId: string, files: File[]) {
  const results: Exercise[] = []
  for (const file of files) results.push(await uploadExercise({ lessonId, file, title: file.name.replace(/\.pdf$/i, '') }))
  return results
}

export async function updateExercise(id: string, fields: Partial<Pick<Exercise, 'title' | 'description' | 'document_kind' | 'has_correction'>>) {
  const { error } = await supabase.from('exercises').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteExercise(exercise: Pick<Exercise, 'id' | 'file_path'>) {
  const { error: dbError } = await supabase.from('exercises').delete().eq('id', exercise.id)
  if (dbError) throw dbError
  const { error: storageError } = await supabase.storage.from(BUCKET).remove([exercise.file_path])
  if (storageError) throw new Error(`La ligne a été supprimée, mais le fichier Storage n'a pas pu être supprimé : ${storageError.message}`)
}

// --------------------------- GESTION DES ANNALES ------------------------
export async function uploadExamPaper(params: { sessionId: string; subjectId: number; seriesId?: number | null; paperKind: ExamPaper['paper_kind']; title: string; file: File }) {
  const { sessionId, subjectId, seriesId = null, paperKind, title, file } = params
  validatePdf(file)
  const { data: userResult } = await supabase.auth.getUser()
  if (!userResult.user) throw new Error('Connecte-toi avant de déposer une annale.')
  const path = `annales/${sessionId}/${crypto.randomUUID()}.pdf`
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: 'application/pdf', upsert: false })
  if (uploadError) throw uploadError
  const result = await supabase.from('exam_papers').insert({ session_id: sessionId, subject_id: subjectId, series_id: seriesId, paper_kind: paperKind, title, file_path: path, file_size_bytes: file.size, uploaded_by: userResult.user.id }).select().single()
  if (result.error) {
    await supabase.storage.from(BUCKET).remove([path])
    throw result.error
  }
  return result.data as ExamPaper
}

export async function updateExamPaper(id: string, fields: Partial<Pick<ExamPaper, 'title' | 'paper_kind' | 'series_id'>>) {
  const { error } = await supabase.from('exam_papers').update(fields).eq('id', id)
  if (error) throw error
}

export async function deleteExamPaper(paper: Pick<ExamPaper, 'id' | 'file_path'>) {
  const { error: dbError } = await supabase.from('exam_papers').delete().eq('id', paper.id)
  if (dbError) throw dbError
  const { error: storageError } = await supabase.storage.from(BUCKET).remove([paper.file_path])
  if (storageError) throw new Error(`L'annale a été supprimée de la base, mais le fichier Storage n'a pas pu être supprimé : ${storageError.message}`)
}

// ------------------------------ PDF URLS --------------------------------
export function getPdfViewUrl(filePath: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(filePath).data.publicUrl
}
export function getPdfDownloadUrl(filePath: string, fileName: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(filePath, { download: `${safeFileName(fileName)}.pdf` }).data.publicUrl
}
function validatePdf(file: File) {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) throw new Error('Seuls les fichiers PDF sont acceptés.')
  if (file.size > MAX_PDF_BYTES) throw new Error('Fichier trop lourd : 20 Mo maximum.')
  if (file.size <= 0) throw new Error('Le fichier est vide.')
}
function safeFileName(name: string) {
  return name.replace(/\.pdf$/i, '').replace(/[^\p{L}\p{N}_ -]/gu, '').trim() || 'document'
}
