import { beforeEach, describe, expect, it } from 'vitest';
import { hasOidFlowParams, resolveInitialRoute } from './routing';
import type { KnownTenant } from './tenant';

const noParams = new URLSearchParams();
const oidParams = new URLSearchParams('code=abc');

describe('resolveInitialRoute', () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	it('renders welcome view when no cached users exist', () => {
		expect(resolveInitialRoute('/', noParams, [])).toEqual({
			type: 'render',
			view: 'welcome',
			props: {},
		});
	});

	it('redirects to tenant path when exactly 1 cached user exists', () => {
		expect(resolveInitialRoute('/', noParams, [tenant('acme')])).toEqual({
			type: 'redirect',
			url: '/id/acme/',
		});
	});

	it('renders select-tenant view when multiple cached users exist', () => {
		const tenants = [tenant('acme'), tenant('globex')];
		expect(resolveInitialRoute('/', noParams, tenants)).toEqual({
			type: 'render',
			view: 'select-tenant',
			props: { tenants },
		});
	});

	it('redirects to first tenant when multiple cached users exist and user appears logged in', () => {
		logIn();
		const tenants = [tenant('acme'), tenant('globex')];
		expect(resolveInitialRoute('/', noParams, tenants)).toEqual({
			type: 'redirect',
			url: '/id/acme/',
		});
	});

	it('renders find-tenant view for /find-tenant', () => {
		expect(resolveInitialRoute('/find-tenant', noParams, [tenant('acme')])).toEqual({
			type: 'render',
			view: 'find-tenant',
			props: {},
		});
	});

	it('renders not-found for non-root paths without OID params', () => {
		expect(resolveInitialRoute('/some-path', noParams, [])).toEqual({
			type: 'render',
			view: 'not-found',
			props: {},
		});

		expect(resolveInitialRoute('/some-path', noParams, [tenant('acme')])).toEqual({
			type: 'render',
			view: 'not-found',
			props: {},
		});
	});

	describe('with OID params', () => {
		it('renders welcome view on root path when no cached users exist', () => {
			expect(resolveInitialRoute('/', oidParams, [])).toEqual({
				type: 'render',
				view: 'welcome',
				props: {},
			});
		});

		it('renders not-found on non-root paths when no cached users exist', () => {
			expect(resolveInitialRoute('/some-path', oidParams, [])).toEqual({
				type: 'render',
				view: 'not-found',
				props: {},
			});
		});

		it.each([
			'/',
			'/some/callback',
		])('redirects to tenant callback from %s with 1 cached user', (pathname) => {
			expect(resolveInitialRoute(pathname, oidParams, [tenant('acme')])).toEqual({
				type: 'redirect',
				url: '/id/acme/cb/?code=abc',
			});
		});

		it.each([
			'/',
			'/some/callback',
		])('renders select-tenant with query from %s with multiple cached users', (pathname) => {
			const tenants = [tenant('acme'), tenant('globex')];
			expect(resolveInitialRoute(pathname, oidParams, tenants)).toEqual({
				type: 'render',
				view: 'select-tenant',
				props: { tenants, query: oidParams },
			});
		});

		it('redirects to first tenant callback when multiple cached users exist and user appears logged in', () => {
			logIn();
			const tenants = [tenant('acme'), tenant('globex')];
			expect(resolveInitialRoute('/some/callback', oidParams, tenants)).toEqual({
				type: 'redirect',
				url: '/id/acme/cb/?code=abc',
			});
		});
	});
});

describe('hasOidFlowParams', () => {
	it.each([
		'credential_offer=x',
		'credential_offer_uri=x',
		'code=x',
		'request_id=x&response_mode=dc_api',
		'request_id=x&response_mode=dc_api.jwt',
		'request_id=x&request=x',
		'client_id=x&request_uri=x',
		'state=x&error=x',
	])('returns true for %s', (query) => {
		expect(hasOidFlowParams(new URLSearchParams(query))).toBe(true);
	});

	it.each([
		'',
		'foo=bar',
		'request_id=x',
		'request_id=x&response_mode=query',
		'client_id=x',
		'request_uri=x',
		'state=x',
		'error=x',
		'code=',
	])('returns false for "%s"', (query) => {
		expect(hasOidFlowParams(new URLSearchParams(query))).toBe(false);
	});
});

function tenant(id: string): KnownTenant {
	return { id, userCount: 1 };
}

function logIn() {
	sessionStorage.setItem('userHandle', 'alice');
	sessionStorage.setItem('sessionState', 'active');
}
