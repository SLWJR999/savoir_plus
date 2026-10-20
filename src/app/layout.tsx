// @ts-ignore Next.js handles this global stylesheet import.
import './globals.css'
import Link from 'next/link'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Figtree } from 'next/font/google'
import PwaRegister from '@/components/PwaRegister'
import { DesktopNav, TabBar } from '@/components/Nav'
import { Logo } from '@/components/Logo'   // ← import ajouté

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const body = Figtree({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'Savoir + | Exercices et annales', template: '%s | Savoir +' },
  description: 'Télécharge gratuitement les exercices PDF du collège et du lycée (Maths, PC, SVT) et les annales du BFEM et du BAC.',
  icons: { apple: '/icons/icon-192.png' },
}
export const viewport: Viewport = { themeColor: '#B3202A', width: 'device-width', initialScale: 1 }

// ❌ Logo supprimé d'ici

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-sand bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" aria-label="Savoir + accueil"><Logo /></Link>
            <DesktopNav />
            <Link href="/admin" className="rounded-lg px-3 py-2 text-xs font-semibold text-stone hover:bg-paper hover:text-brand sm:text-sm">Espace prof</Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-6 sm:px-6 sm:pt-10 md:pb-16">{children}</main>
        <footer className="mb-[60px] border-t-4 border-gold bg-ink text-white md:mb-0">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Logo light />   {/* ← fonctionne toujours */}
            <p className="max-w-xs text-sm text-white/70">Exercices, corrigés et annales du BFEM et du BAC, gratuits et sans compte.</p>
          </div>
        </footer>
        <TabBar />
        <PwaRegister />
      </body>
    </html>
  )
}