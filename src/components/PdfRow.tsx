import { getPdfViewUrl, getPdfDownloadUrl } from '@/lib/supabase'
import { fmtSize, Icon } from './ui'
export default function PdfRow({ title, path, size, badges = [] }: { title: string; path: string; size: number | null; badges?: string[] }) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-sand bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><Icon n="doc" className="h-6 w-6" /></span>
        <div className="min-w-0">
          <p className="break-words font-semibold leading-snug">{title}</p>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-stone">
            {badges.map(b => <span key={b} className="chip">{b}</span>)}
            <span>PDF{fmtSize(size) ? ', ' + fmtSize(size) : ''}</span>
          </p>
        </div>
      </div>
      <div className="grid shrink-0 grid-cols-2 gap-2 sm:flex">
        <a href={getPdfViewUrl(path)} target="_blank" rel="noopener noreferrer" className="btn-ghost"><Icon n="eye" className="h-4 w-4" />Voir</a>
        <a href={getPdfDownloadUrl(path, title)} className="btn"><Icon n="download" className="h-4 w-4" />Télécharger</a>
      </div>
    </li>
  )
}
