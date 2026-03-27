import { ArrowRightIcon } from 'lucide-react';
import Hero from '../components/shared/Hero';
import TenantMeta from '../components/tenants/TenantMeta';
import Link from '../components/ui/elements/Link';
import { buildTenantRoutePath, type KnownTenant } from '../lib/tenant';

export type SelectTenantViewProps = {
	tenants: KnownTenant[];
};

export default function SelectTenantView({ tenants }: SelectTenantViewProps) {
	return (
		<div className="grow flex flex-col items-center justify-center px-6 py-8">
			<Hero />
			<div className="w-[min(100%,400px)] text-center">
				<p>Please select your tenant to continue:</p>
				<ul className="mt-4 space-y-4">
					{tenants.map((tenant) => (
						<li key={tenant.id}>
							<Link
								key={tenant.id}
								square
								className="w-full mb-2 flex justify-between gap-3"
								href={buildTenantRoutePath(tenant.id)}
							>
								<TenantMeta knownTenants={tenants} tenantId={tenant.id} />
								<ArrowRightIcon size={20} className="m-0.5 shrink-0" />
							</Link>
						</li>
					))}
					<hr className="my-4 border-t border-lm-gray-400 dark:border-dm-gray-600" />
					{!tenants.find((t) => t.id === 'default') && (
						<li key="default">
							<Link variant="link" href={buildTenantRoutePath('default')}>
								Log in to other tenant
							</Link>
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}
