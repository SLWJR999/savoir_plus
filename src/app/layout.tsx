import './globals.css'
import Link from 'next/link'
import type { Metadata, Viewport } from 'next'
import PwaRegister from '@/components/PwaRegister'

export const metadata: Metadata = {
  title: { default: 'Exercices & Annales', template: '%s | Exercices & Annales' },
  description: 'Télécharge gratuitement les exercices PDF du collège et du lycée (Maths, PC, SVT) et les annales du BFEM et du BAC.',
  icons: { apple: '/icons/icon-192.png' },
}
export const viewport: Viewport = { themeColor: '#0b7a4b', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-bold text-brand">Exercices &amp; Annales</Link>
            <Link href="/admin" className="text-xs text-slate-500 hover:underline">Espace prof</Link>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
        <PwaRegister />
      </body>
    </html>
  )
}
