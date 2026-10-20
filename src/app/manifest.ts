import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Savoir +', short_name: 'Savoir +', description: 'Exercices PDF du collège et du lycée, annales BFEM et BAC.',
    start_url: '/', display: 'standalone', background_color: '#F5EFE4', theme_color: '#B3202A', lang: 'fr',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
