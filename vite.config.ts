/// <reference types="vitest/config" />
import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { defineConfig, type Plugin, transformWithOxc } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

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

function serviceWorker(): Plugin {
	return {
		name: 'service-worker',
		async generateBundle(_options, bundle) {
			const assets = Object.keys(bundle).map((name) => `/${name}`);
			const precacheURLs = ['/', '/favicon.ico', ...assets];

			let source = await readFile('src/sw.ts', 'utf-8');

			source = replaceDeclaredConst(
				source,
				'__SW_VERSION__',
				process.env.npm_package_version || crypto.randomUUID(),
			);

			source = replaceDeclaredConst(
				source,
				'__SW_PRECACHE_URLS__',
				precacheURLs,
			);

			const { code } = await transformWithOxc(source, 'sw.ts');

			this.emitFile({ type: 'asset', fileName: 'sw.js', source: stripExport(code) });
		},
	};
}

function replaceDeclaredConst(source: string, name: string, value: any): string {
	const regex = new RegExp(`(?<!declare const )${name}`, 'g');
	return source.replace(regex, JSON.stringify(value));
}

// TODO: this is ugly, find better solution to build the service worker.
function stripExport(code: string): string {
	return code.replace(/^export\s*\{\s*\};?\s*$/gm, '').trimEnd();
}
