import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Savoir + | Exercices et annales', // Le nom complet du widget
    short_name: 'Savoir +', // Le nom qui s'affiche sous l'icône sur mobile
    description: 'Télécharge gratuitement les exercices PDF du collège et du lycée.',
    start_url: '/',
    display: 'standalone', // Pour que ça s'ouvre comme une vraie app (sans la barre d'adresse)
    background_color: '#ffffff',
    theme_color: '#B3202A', // Ton rouge
    icons: [
      {
        src: '/icons/icon-192.png', // L'icône carrée qui s'affiche sur le téléphone
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png', 
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}