const CACHE_NAME = 'nura-v3';
const ASSETS = [
  './',
  './index.html',
  './styles/style.css',
  './scripts/script.js',
  './firebase-auth.js',
  './manifest.json',
  './pages/cadastro.html',
  './pages/perfil.html',
  './pages/produtos.html',
  './pages/carrinho.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((response) => response || fetch(e.request)));
});