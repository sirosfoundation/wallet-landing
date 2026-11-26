import { ArrowLeftIcon } from 'lucide-react';
import Hero from '../components/shared/Hero';
import FindTenant from '../components/tenants/FindTenant';
import Link from '../components/ui/elements/Link';

export type FindTenantViewProps = Record<string, never>;

export default function FindTenantView() {
	return (
		<div className="grow flex flex-col items-center justify-center px-6 py-8">
			<Hero
				title={
					<>
						Find your <span className="text-primary dark:text-brand-light">wallet tenant</span>
					</>
				}
			/>
			<FindTenant />
			<div className="mt-4">
				<Link href="/" variant="default" icon={ArrowLeftIcon}>
					Back
				</Link>
			</div>
		</div>
	);
}
