import { supabase, type Subject, type Lesson } from './supabase'
export const BUCKET = 'documents-scolaires'

export async function getProgramBySlug(slug: string) {
  const { data, error } = await supabase.from('class_programs')
    .select('id, slug, display_name, grades!inner(slug, name, levels!inner(slug, name))').eq('slug', slug).eq('active', true).maybeSingle()
  if (error) throw error
  return data as unknown as { id: string; slug: string; display_name: string; grades: { slug: string; name: string; levels: { slug: string; name: string } } } | null
}

export async function getSubjects() {
  const { data, error } = await supabase.from('subjects').select('*').eq('active', true).order('position')
  if (error) throw error
  return data as Subject[]
}

export async function getAllPrograms() {
  const { data, error } = await supabase.from('class_programs').select('id, slug, display_name, position, grades(position, level_id)').eq('active', true)
  if (error) throw error
  const rows = data as unknown as { id: string; slug: string; display_name: string; position: number; grades: { position: number; level_id: number } }[]
  return rows.sort((a, b) => a.grades.level_id - b.grades.level_id || a.grades.position - b.grades.position || a.position - b.position)
}

export type LessonRow = Lesson & { exercises_count: number }

// Supprime une leçon ET ses PDF dans Storage (la base ne supprime que les lignes).
export async function deleteLessonCompletely(lessonId: string) {
  const { data: ex, error } = await supabase.from('exercises').select('file_path').eq('lesson_id', lessonId)
  if (error) throw error
  const paths = (ex ?? []).map(e => e.file_path)
  if (paths.length) { const r = await supabase.storage.from(BUCKET).remove(paths); if (r.error) throw r.error }
  const del = await supabase.from('lessons').delete().eq('id', lessonId)
  if (del.error) throw del.error
}
