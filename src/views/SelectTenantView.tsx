import type { KnownTenant } from '../lib/tenant';

export type SelectTenantViewProps = {
	tenants: KnownTenant[];
};

export default function SelectTenantView({ tenants }: SelectTenantViewProps) {
	return (
		<div>
			<h1>Please select your tenant to continue.</h1>
			<ul>
				{tenants.map((tenant) => (
					<li key={tenant.id}>
						<a href={`/id/${tenant.id}`}>{tenant.displayName ?? tenant.id}</a>
					</li>
				))}
				{!tenants.find((t) => t.id === 'default') && (
					<li key="default">
						<a href="/id/default">Default Tenant</a>
					</li>
				)}
			</ul>
		</div>
	);
}
