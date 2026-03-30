/**
 * Most functions here are ported from wallet-frontend, to be used to extract
 * cached users from local storage.
 * @see docs/porting-notes.md
 */

/**
 * URL path prefix for tenants.
 */
export const TENANT_PATH_PREFIX = 'id';

/**
 * The default tenant ID used by the backend for single-tenant mode
 * and legacy users without tenant association.
 */
export const DEFAULT_TENANT_ID = 'default';

/**
 * Build the frontend route path for a given tenant.
 *
 * @param tenantId - The tenant ID
 * @param subPath - Optional path within the tenant (e.g., 'settings')
 * @returns The frontend route path
 */
export function buildTenantRoutePath(tenantId: string | undefined, subPath?: string): string {
	const cleanSubPath = subPath ? subPath.replace(/^\/+/, '') : '';

	return cleanSubPath
		? `/${TENANT_PATH_PREFIX}/${tenantId}/${cleanSubPath}`
		: `/${TENANT_PATH_PREFIX}/${tenantId}/`;
}

export type CachedUser = {
	tenant?: {
		id: string;
		displayName?: string;
	};
};

/**
 * Retrieve list of cached users from local storage.
 */
export function getCachedUsers(): CachedUser[] {
	const stored = localStorage.getItem('cachedUsers');

	if (!stored) return [];

	try {
		return JSON.parse(stored);
	} catch (e) {
		console.error('Failed to parse cached users from localStorage:', e);
		return [];
	}
}

export type KnownTenant = {
	id: string;
	displayName?: string;
	userCount: number;
};

/**
 * Derives a list of known tenants from cached users.
 * Uses tenant metadata if available, falls back to extracting from userHandle.
 *
 * @param cachedUsers - Array of cached users from localStorage
 * @returns Array of unique tenants with user counts
 */
export function getKnownTenants(cachedUsers: CachedUser[]): KnownTenant[] {
	const tenantMap = new Map<string, KnownTenant>();

	for (const user of cachedUsers) {
		const tenantId = user.tenant?.id ?? DEFAULT_TENANT_ID;
		const displayName = user.tenant?.displayName;

		const existing = tenantMap.get(tenantId);
		if (existing) {
			existing.userCount++;

			if (displayName && !existing.displayName) {
				existing.displayName = displayName;
			}
		} else {
			tenantMap.set(tenantId, {
				id: tenantId,
				displayName,
				userCount: 1,
			});
		}
	}

	return Array.from(tenantMap.values());
}

/**
 * User appears to be logged in based on the data in session storage.
 */
export function appearsLoggedIn(): boolean {
  const userHandle = sessionStorage.getItem('userHandle');
  const sessionState = sessionStorage.getItem('sessionState');

  return !!userHandle && !!sessionState;
}
