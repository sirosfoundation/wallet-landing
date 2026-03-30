import type { ViewMap } from '../views';
import { appearsLoggedIn, buildTenantRoutePath, type KnownTenant } from './tenant';

type RedirectRoute = {
	type: 'redirect';
	url: string;
};

type RenderRoute = {
	[V in keyof ViewMap]: {
		type: 'render';
		view: V;
		props: ViewMap[V];
	};
}[keyof ViewMap];

type ErrorRoute = {
	type: 'error';
	message: string;
};

export type InitialRoute = RedirectRoute | RenderRoute | ErrorRoute;

export function resolveInitialRoute(pathname: string, knownTenants: KnownTenant[]): InitialRoute {
	const isBasePath = pathname === '/';
	const hasOneTenant = knownTenants.length === 1;
	const hasManyTenants = knownTenants.length > 1;
	const appearsToHaveSession = hasManyTenants && appearsLoggedIn();

	if (!isBasePath) {
		return {
			type: 'render',
			view: 'not-found',
			props: {},
		};
	}

	if (hasOneTenant || appearsToHaveSession) {
		return {
			type: 'redirect',
			url: buildTenantRoutePath(knownTenants[0].id),
		};
	}

	if (hasManyTenants) {
		return {
			type: 'render',
			view: 'select-tenant',
			props: {
				tenants: knownTenants,
			},
		};
	}

	return {
		type: 'render',
		view: 'welcome',
		props: {},
	};
}
