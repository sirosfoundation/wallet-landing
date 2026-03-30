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
			<div className="w-[min(100%,450px)] relative p-8 sm:px-12 space-y-4 md:space-y-6 lg:space-y-8 bg-white rounded-lg dark:bg-dm-gray-900 border border-lm-gray-400 dark:border-dm-gray-600">
				<h2 className="pt-4 text-xl font-bold leading-tight tracking-tight text-dm-gray-900 md:text-2xl text-center dark:text-white">
					Select your wallet to continue
				</h2>
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
					{!tenants.find((t) => t.id === 'default') && (
						<li key="default" className="mt-5 text-sm">
							<Link variant="link" href={buildTenantRoutePath('default')}>
								Log in to another wallet
							</Link>
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}
