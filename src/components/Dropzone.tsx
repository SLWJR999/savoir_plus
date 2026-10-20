'use client'
import { useRef, useState } from 'react'
export default function Dropzone({ onFiles, disabled }: { onFiles: (f: File[]) => void; disabled?: boolean }) {
  const ref = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const pick = (list: FileList | null) => { const f = Array.from(list ?? []).filter(x => x.name.toLowerCase().endsWith('.pdf')); if (f.length) onFiles(f) }
  return (
    <div
      onDragOver={e => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)}
      onDrop={e => { e.preventDefault(); setOver(false); if (!disabled) pick(e.dataTransfer.files) }}
      className={`rounded-xl border-2 border-dashed p-6 text-center ${over ? 'border-brand bg-emerald-50' : 'border-slate-300 bg-white'}`}>
      <p className="text-sm text-slate-600">Glisse tes PDF ici ou</p>
      <button type="button" className="btn mt-2" disabled={disabled} onClick={() => ref.current?.click()}>Choisir des PDF</button>
      <p className="mt-2 text-xs text-slate-500">PDF uniquement, 20 Mo maximum par fichier</p>
      <input ref={ref} type="file" accept="application/pdf,.pdf" multiple hidden onChange={e => { pick(e.target.files); e.target.value = '' }} />
    </div>
  )
}
