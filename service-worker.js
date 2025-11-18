// Un nombre de caché único que cambiará con cada actualización importante.
// Cambiar esta versión forzará al service worker a reinstalarse y limpiar cachés antiguos.
const CACHE_VERSION = 'power-energy-reporter-v2';
const urlsToCache = [
  '/',
  '/index.html',
];

// 1. Evento 'install': Se activa cuando se instala un nuevo service worker.
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    // Forzamos la activación del nuevo service worker tan pronto como termina la instalación.
    // Esto es clave para que las actualizaciones se muestren de inmediato.
    self.skipWaiting()
  );
});

// 2. Evento 'activate': Se activa después de la instalación, cuando el SW toma el control.
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activando...');
  event.waitUntil(
    Promise.all([
      // Tomamos control inmediato de todas las pestañas abiertas de la app.
      self.clients.claim(),
      // Limpiamos los cachés antiguos para liberar espacio y evitar conflictos.
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_VERSION) {
              console.log('[Service Worker] Borrando caché antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// 3. Evento 'fetch': Intercepta todas las peticiones de red de la aplicación.
self.addEventListener('fetch', event => {
  // Estrategia: "Network First, falling back to Cache"
  // Esto asegura que los usuarios siempre obtengan la versión más reciente si tienen conexión.
  // Si no hay conexión, se sirve la versión guardada en caché.
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Si la petición a la red fue exitosa, la guardamos en caché para futuras visitas sin conexión
        // y la devolvemos al navegador.
        return caches.open(CACHE_VERSION).then(cache => {
          // No guardamos en caché las peticiones de Firebase o Cloudinary para evitar problemas.
          if (!event.request.url.includes('firebase') && !event.request.url.includes('cloudinary')) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Si la petición a la red falla (porque no hay conexión), intentamos servir desde el caché.
        console.log('[Service Worker] Red no disponible, buscando en caché:', event.request.url);
        return caches.match(event.request);
      })
  );
});

// 1. Evento 'install': Se activa cuando se instala un nuevo service worker.
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    // Forzamos la activación del nuevo service worker tan pronto como termina la instalación.
    // Esto es clave para que las actualizaciones se muestren de inmediato.
    self.skipWaiting()
  );
});

// 2. Evento 'activate': Se activa después de la instalación, cuando el SW toma el control.
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activando...');
  event.waitUntil(
    Promise.all([
      // Tomamos control inmediato de todas las pestañas abiertas de la app.
      self.clients.claim(),
      // Limpiamos los cachés antiguos para liberar espacio y evitar conflictos.
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_VERSION) {
              console.log('[Service Worker] Borrando caché antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// 3. Evento 'fetch': Intercepta todas las peticiones de red de la aplicación.
self.addEventListener('fetch', event => {
  // Estrategia: "Network First, falling back to Cache"
  // Esto asegura que los usuarios siempre obtengan la versión más reciente si tienen conexión.
  // Si no hay conexión, se sirve la versión guardada en caché.
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Si la petición a la red fue exitosa, la guardamos en caché para futuras visitas sin conexión
        // y la devolvemos al navegador.
        return caches.open(CACHE_VERSION).then(cache => {
          // No guardamos en caché las peticiones de Firebase o Cloudinary para evitar problemas.
          if (!event.request.url.includes('firebase') && !event.request.url.includes('cloudinary')) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // Si la petición a la red falla (porque no hay conexión), intentamos servir desde el caché.
        console.log('[Service Worker] Red no disponible, buscando en caché:', event.request.url);
        return caches.match(event.request);
      })
  );
});
