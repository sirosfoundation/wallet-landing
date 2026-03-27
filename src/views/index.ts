import { createElement, type JSX, type ReactElement } from 'react';
import SelectTenantView, { type SelectTenantViewProps } from './SelectTenantView';
import WelcomeView from './WelcomeView';
import NotFound from './NotFound';

export type ViewMap = {
	'select-tenant': SelectTenantViewProps;
	welcome: Record<string, never>;
	'not-found': Record<string, never>;
};

export type ViewProps<V extends keyof ViewMap> = ViewMap[V];

export type ViewComponent<V extends keyof ViewMap> = (props: ViewProps<V>) => JSX.Element;

export type Views = {
	[V in keyof ViewMap]: ViewComponent<V>;
};

export const views: Views = {
	'select-tenant': SelectTenantView,
	welcome: WelcomeView,
	'not-found': NotFound,
};

export function renderView<V extends keyof ViewMap>(view: V, props: ViewMap[V]): ReactElement {
	const Component = views[view] as React.ComponentType<ViewMap[V]>;
	return createElement(Component, props);
}
