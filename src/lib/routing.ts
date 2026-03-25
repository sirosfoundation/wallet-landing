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
	if (pathname !== '/') {
		return {
			type: 'error',
			message: `Disallowed root path. The wallet landing page should only be served at the root path '/', got: '${pathname}'.`,
		};
	}

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

	return {
		type: 'render',
		view: 'welcome',
		props: {
		},
	};
}
