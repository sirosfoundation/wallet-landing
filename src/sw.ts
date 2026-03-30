/// <reference lib="webworker" />

export type {};

declare const self: ServiceWorkerGlobalScope;
declare const __SW_VERSION__: string;
declare const __SW_PRECACHE_URLS__: string[];

const SW_VERSION = __SW_VERSION__;
const PRECACHE_URLS: string[] = __SW_PRECACHE_URLS__;

const CACHE_NAME = `wallet-landing--${SW_VERSION}`;

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			await cache.addAll(PRECACHE_URLS);
		})(),
	);
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
		})(),
	);
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	const { request } = event;

	if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
		return;
	}

	// Navigation requests
	if (request.mode === 'navigate') {
		event.respondWith(
			(async () => {
				try {
					const response = await fetch(request);
					const cache = await caches.open(CACHE_NAME);

					await cache.put(request, response.clone());

					return response;
				} catch {
					const cached = await caches.match('/');

					return cached || new Response('Offline', { status: 503 });
				}
			})(),
		);
		return;
	}

	// Static assets
	event.respondWith(
		(async () => {
			const cached = await caches.match(request);
			if (cached) return cached;

			const response = await fetch(request);
			if (response.ok) {
				const cache = await caches.open(CACHE_NAME);
				await cache.put(request, response.clone());
			}
			return response;
		})(),
	);
});
