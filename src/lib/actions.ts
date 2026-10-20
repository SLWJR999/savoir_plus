'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateLessonPage() {
  revalidatePath('/lecon/[id]', 'page')
}

export async function revalidateAnnalesPage() {
  revalidatePath('/annales/[exam]/[matiere]', 'page')
}