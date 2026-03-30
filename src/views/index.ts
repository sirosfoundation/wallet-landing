import { createElement, lazy, type ReactElement, type ReactNode } from 'react';
import { type SelectTenantViewProps } from './SelectTenantView';

export type ViewMap = {
	'select-tenant': SelectTenantViewProps;
	welcome: Record<string, never>;
	'not-found': Record<string, never>;
};

export type ViewProps<V extends keyof ViewMap> = ViewMap[V];

export type ViewComponent<V extends keyof ViewMap> = (props: ViewProps<V>) => ReactNode;

export type Views = {
	[V in keyof ViewMap]: ViewComponent<V>;
};

export const views: Views = {
	'select-tenant': lazy(()=> import('./SelectTenantView')),
	welcome: lazy(() => import('./WelcomeView')),
	'not-found': lazy(() => import('./NotFound')),
};

export function renderView<V extends keyof ViewMap>(view: V, props: ViewMap[V]): ReactElement {
	const Component = views[view] as React.ComponentType<ViewMap[V]>;
	return createElement(Component, props);
}
