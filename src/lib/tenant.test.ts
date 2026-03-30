import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	appearsLoggedIn,
	buildTenantRoutePath,
	type CachedUser,
	DEFAULT_TENANT_ID,
	getCachedUsers,
	getKnownTenants,
} from './tenant';

describe('buildTenantRoutePath', () => {
	it('builds a basic tenant path', () => {
		expect(buildTenantRoutePath('acme')).toBe('/id/acme/');
	});

	it('appends a subPath', () => {
		expect(buildTenantRoutePath('acme', 'login')).toBe('/id/acme/login');
	});

	it('strips leading slashes from subPath', () => {
		expect(buildTenantRoutePath('acme', '/login')).toBe('/id/acme/login');
	});

	it('handles undefined tenantId', () => {
		expect(buildTenantRoutePath(undefined)).toBe('/id/undefined/');
	});
});

describe('getCachedUsers', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('returns [] when nothing in localStorage', () => {
		expect(getCachedUsers()).toEqual([]);
	});

	it('returns parsed array for valid JSON', () => {
		const users: CachedUser[] = [{ tenant: { id: 'acme' } }];
		localStorage.setItem('cachedUsers', JSON.stringify(users));
		expect(getCachedUsers()).toEqual(users);
	});

	it('returns [] for invalid JSON and logs error', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		localStorage.setItem('cachedUsers', '{bad json');
		expect(getCachedUsers()).toEqual([]);
		expect(spy).toHaveBeenCalledOnce();
		spy.mockRestore();
	});

	it('returns [] for an empty array string', () => {
		localStorage.setItem('cachedUsers', '[]');
		expect(getCachedUsers()).toEqual([]);
	});
});

describe('getKnownTenants', () => {
	it('returns [] for empty input', () => {
		expect(getKnownTenants([])).toEqual([]);
	});

	it('returns a single tenant for one user', () => {
		const users: CachedUser[] = [{ tenant: { id: 'acme' } }];
		expect(getKnownTenants(users)).toEqual([{ id: 'acme', displayName: undefined, userCount: 1 }]);
	});

	it('counts multiple users on the same tenant', () => {
		const users: CachedUser[] = [{ tenant: { id: 'acme' } }, { tenant: { id: 'acme' } }];
		expect(getKnownTenants(users)).toEqual([{ id: 'acme', displayName: undefined, userCount: 2 }]);
	});

	it('separates users across different tenants', () => {
		const users: CachedUser[] = [{ tenant: { id: 'acme' } }, { tenant: { id: 'globex' } }];
		const result = getKnownTenants(users);
		expect(result).toHaveLength(2);
		expect(result).toContainEqual({ id: 'acme', displayName: undefined, userCount: 1 });
		expect(result).toContainEqual({ id: 'globex', displayName: undefined, userCount: 1 });
	});

	it('falls back to DEFAULT_TENANT_ID when tenant property is missing', () => {
		const users: CachedUser[] = [{}];
		expect(getKnownTenants(users)).toEqual([
			{ id: DEFAULT_TENANT_ID, displayName: undefined, userCount: 1 },
		]);
	});

	it('falls back to DEFAULT_TENANT_ID when tenant has no id', () => {
		// biome-ignore lint/suspicious/noExplicitAny: testing malformed data
		const users: CachedUser[] = [{ tenant: {} as any }];
		expect(getKnownTenants(users)).toEqual([
			{ id: DEFAULT_TENANT_ID, displayName: undefined, userCount: 1 },
		]);
	});

	it('merges displayName from a later user when the first lacks one', () => {
		const users: CachedUser[] = [
			{ tenant: { id: 'acme' } },
			{ tenant: { id: 'acme', displayName: 'Acme Corp' } },
		];
		expect(getKnownTenants(users)).toEqual([
			{ id: 'acme', displayName: 'Acme Corp', userCount: 2 },
		]);
	});

	it('keeps the first displayName when a later user has a different one', () => {
		const users: CachedUser[] = [
			{ tenant: { id: 'acme', displayName: 'Acme Corp' } },
			{ tenant: { id: 'acme', displayName: 'Acme Inc' } },
		];
		expect(getKnownTenants(users)).toEqual([
			{ id: 'acme', displayName: 'Acme Corp', userCount: 2 },
		]);
	});
});

describe('appearsLoggedIn', () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	it('returns false when sessionStorage is empty', () => {
		expect(appearsLoggedIn()).toBe(false);
	});

	it('returns false when only userHandle is set', () => {
		sessionStorage.setItem('userHandle', 'alice');
		expect(appearsLoggedIn()).toBe(false);
	});

	it('returns false when only sessionState is set', () => {
		sessionStorage.setItem('sessionState', 'active');
		expect(appearsLoggedIn()).toBe(false);
	});

	it('returns true when both userHandle and sessionState are set', () => {
		sessionStorage.setItem('userHandle', 'alice');
		sessionStorage.setItem('sessionState', 'active');
		expect(appearsLoggedIn()).toBe(true);
	});
});
