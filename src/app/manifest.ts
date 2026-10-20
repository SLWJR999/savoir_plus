import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Exercices & Annales', short_name: 'Exos', description: 'Exercices PDF du collège et du lycée, annales BFEM et BAC.',
    start_url: '/', display: 'standalone', background_color: '#f3f6fb', theme_color: '#0b7a4b', lang: 'fr',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
