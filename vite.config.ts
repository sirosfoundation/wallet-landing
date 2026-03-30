/// <reference types="vitest/config" />
import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { defineConfig, type Plugin, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function serviceWorker(): Plugin {
	const inject = (source: string) =>
		source.replace('${__SW_VERSION__}', process.env.npm_package_version || crypto.randomUUID());

	// TODO: this is ugly, find better solution to build and serve the service worker.
	const stripExport = (code: string) =>
		code.replace(/^export\s*\{\s*\};?\s*$/gm, '').trimEnd();

	return {
		name: 'service-worker',
		async generateBundle(_options, bundle) {
			const assets = Object.keys(bundle).map((name) => `/${name}`);
			const precacheURLs = ['/', '/favicon.ico', ...assets];

			let source = inject(await readFile('src/sw.ts', 'utf-8'));
			source = source.replace(/(?<!declare const )__SW_PRECACHE_URLS__/, JSON.stringify(precacheURLs));

			const { code } = await transformWithOxc(source, 'sw.ts');

			this.emitFile({ type: 'asset', fileName: 'sw.js', source: stripExport(code) });
		},
	};
}

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		serviceWorker(),
	],
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.test.ts'],
	},
})
