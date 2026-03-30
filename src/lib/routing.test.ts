import { beforeEach, describe, expect, it } from 'vitest';
import { resolveInitialRoute } from './routing';
import type { KnownTenant } from './tenant';

const tenant = (id: string): KnownTenant => ({ id, userCount: 1 });

describe('resolveInitialRoute', () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	it('renders welcome view when no cached users exist', () => {
		expect(resolveInitialRoute('/', [])).toEqual({
			type: 'render',
			view: 'welcome',
			props: {},
		});
	});

	it('redirects to tenant path when exactly 1 cached user exists', () => {
		expect(resolveInitialRoute('/', [tenant('acme')])).toEqual({
			type: 'redirect',
			url: '/id/acme/',
		});
	});

	it('renders select-tenant view when multiple cached users exist', () => {
		const tenants = [tenant('acme'), tenant('globex')];
		expect(resolveInitialRoute('/', tenants)).toEqual({
			type: 'render',
			view: 'select-tenant',
			props: { tenants },
		});
	});

	it('redirects to first tenant when multiple cached users exist and user appears logged in', () => {
		sessionStorage.setItem('userHandle', 'alice');
		sessionStorage.setItem('sessionState', 'active');
		const tenants = [tenant('acme'), tenant('globex')];
		expect(resolveInitialRoute('/', tenants)).toEqual({
			type: 'redirect',
			url: '/id/acme/',
		});
	});

	it('renders not-found for non-root paths regardless of cached users', () => {
		expect(resolveInitialRoute('/some-path', [])).toEqual({
			type: 'render',
			view: 'not-found',
			props: {},
		});

		expect(resolveInitialRoute('/some-path', [tenant('acme')])).toEqual({
			type: 'render',
			view: 'not-found',
			props: {},
		});
	});
});
