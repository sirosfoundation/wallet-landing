import type { ViewMap } from '../views';
import { buildTenantRoutePath, type KnownTenant } from './tenant';

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
	if (knownTenants.length === 1) {
		return {
			type: 'redirect',
			url: buildTenantRoutePath(knownTenants[0].id),
		};
	}

	if (knownTenants.length > 1) {
		return {
			type: 'render',
			view: 'select-tenant',
			props: {
				tenants: knownTenants,
			},
		};
	}

	if (pathname === '/') {
		return {
			type: 'render',
			view: 'welcome',
			props: {},
		};
	}

	return {
		type: 'render',
		view: 'not-found',
		props: {},
	};
}
