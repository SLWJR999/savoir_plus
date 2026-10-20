import { getPdfViewUrl, getPdfDownloadUrl } from '@/lib/supabase'
import { fmtSize } from './ui'
export default function PdfRow({ title, path, size, badges = [] }: { title: string; path: string; size: number | null; badges?: string[] }) {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="break-words font-semibold">{title}</p>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {badges.map(b => <span key={b} className="rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800">{b}</span>)}
          <span>PDF{fmtSize(size) ? ' · ' + fmtSize(size) : ''}</span>
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <a href={getPdfViewUrl(path)} target="_blank" rel="noopener noreferrer" className="btn-ghost">Voir</a>
        <a href={getPdfDownloadUrl(path, title)} className="btn">Télécharger</a>
      </div>
    </li>
  )
}
