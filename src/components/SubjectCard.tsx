import Link from 'next/link'
import { Icon, subjectTone } from './ui'
export default function SubjectCard({ href, slug, name }: { href: string; slug: string; name: string }) {
  return (
    <Link href={href} className="tile flex items-center gap-4 !p-5">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${subjectTone[slug] ?? 'bg-sand text-ink'}`}><Icon n={['maths', 'pc', 'svt'].includes(slug) ? slug : 'book'} className="h-6 w-6" /></span>
      <span className="min-w-0 flex-1 leading-snug">{name}</span>
      <Icon n="chevron" className="h-5 w-5 shrink-0 text-gold" />
    </Link>
  )
}
