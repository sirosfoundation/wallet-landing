import { useEffect, useState } from 'react';

export type SearchStatus = 'idle' | 'checking' | 'found' | 'not-found' | 'error';

const SEARCH_DEBOUNCE_MS = 400;

export default function useFindTenant() {
	const [query, setQuery] = useState('');
	const [status, setStatus] = useState<SearchStatus>('idle');

	useEffect(() => {
		const tenantId = query.trim().toLowerCase();
		if (!tenantId) {
			setStatus('idle');
			return;
		}

		setStatus('checking');
		const controller = new AbortController();

		const timeout = setTimeout(async () => {
			try {
				const res = await fetch(`/id/${encodeURIComponent(tenantId)}/index.html`, {
					signal: controller.signal,
				});

				const found = res.ok && !isLandingPage(await res.text());
				if (!controller.signal.aborted) {
					setStatus(found ? 'found' : 'not-found');
				}
			} catch {
				if (!controller.signal.aborted) setStatus('error');
			}
		}, SEARCH_DEBOUNCE_MS);

		return () => {
			clearTimeout(timeout);
			controller.abort();
		};
	}, [query]);

	return {
		query,
		setQuery,
		status,
	};
}

/**
 * The server falls back to the landing page for unknown tenants,
 * so a response marked as the landing app means the tenant doesn't exist.
 */
function isLandingPage(html: string): boolean {
	const doc = new DOMParser().parseFromString(html, 'text/html');
	const app = doc.querySelector('meta[name="siros-app"]')?.getAttribute('content');
	return app === 'landing';
}
