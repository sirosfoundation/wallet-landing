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

export function resolveInitialRoute(
	pathname: string,
	queryParams: URLSearchParams,
	knownTenants: KnownTenant[],
): InitialRoute {
	const query = hasOidFlowParams(queryParams) ? queryParams : undefined;

	if (pathname === '/find-tenant' || pathname === '/find-tenant/') {
		return {
			type: 'render',
			view: 'find-tenant',
			props: {},
		};
	}

	if (pathname !== '/' && !(query && knownTenants.length > 0)) {
		return {
			type: 'render',
			view: 'not-found',
			props: {},
		};
	}

	const hasManyTenants = knownTenants.length > 1;

	if (knownTenants.length === 1 || (hasManyTenants && appearsLoggedIn())) {
		return {
			type: 'redirect',
			url: buildTenantRoutePath(knownTenants[0].id, query && `cb/?${query.toString()}`),
		};
	}

	if (hasManyTenants) {
		return {
			type: 'render',
			view: 'select-tenant',
			props: {
				tenants: knownTenants,
				query,
			},
		};
	}

	return {
		type: 'render',
		view: 'welcome',
		props: {},
	};
}

/**
 * Parses a callback URL to determine the OpenID flow type and relevant parameters.
 */
export function hasOidFlowParams(params: URLSearchParams): boolean {
	const responseMode = params.get('response_mode');

	return Boolean(
		params.get('credential_offer') ||
			params.get('credential_offer_uri') ||
			params.get('code') ||
			(params.get('request_id') &&
				(responseMode === 'dc_api' || responseMode === 'dc_api.jwt' || params.get('request'))) ||
			(params.get('client_id') && params.get('request_uri')) ||
			(params.get('state') && params.get('error')),
	);
}
