import AdminGate from '@/components/AdminGate'
export const metadata = { title: 'Espace prof', robots: { index: false, follow: false } }
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminGate>{children}</AdminGate>
}
