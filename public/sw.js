// v2 : on ne touche plus aux pages (HTML / données Next.js) : elles sont déjà servies par le CDN de Vercel.
// On met seulement en cache les fichiers statiques (JS/CSS/icônes), qui ne changent pas pour une même version.
const C = 'exos-v2'
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== C).map(k => caches.delete(k)))).then(() => clients.claim())
))
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url)
  if (r.method !== 'GET' || u.origin !== self.location.origin) return
  if (!(u.pathname.startsWith('/_next/static/') || u.pathname.startsWith('/icons/'))) return
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { const c = res.clone(); caches.open(C).then(x => x.put(r, c)); return res })))
})
