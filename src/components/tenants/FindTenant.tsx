import {
	CircleCheckIcon,
	CircleQuestionMarkIcon,
	CircleXIcon,
	LoaderCircleIcon,
	SearchIcon,
} from 'lucide-react';
import { useId } from 'react';
import type { SearchStatus } from '../../hooks/useFindTenant';
import useFindTenant from '../../hooks/useFindTenant';
import { buildTenantRoutePath } from '../../lib/tenant';
import Button from '../ui/elements/Button';

export default function FindTenant() {
	const inputId = useId();
	const { query, setQuery, status } = useFindTenant();

	const handleNavigate = () => {
		window.location.assign(buildTenantRoutePath(encodeURIComponent(query.trim().toLowerCase())));
	};

	return (
		<div className="w-[min(100%,450px)] relative p-8 sm:px-12 space-y-4 md:space-y-6 lg:space-y-8 bg-white rounded-lg dark:bg-dm-gray-900 border border-lm-gray-400 dark:border-dm-gray-600">
			<div className="mb-4 relative">
				<label
					className="block text-lm-gray-800 dark:text-dm-gray-200 text-sm font-bold mb-2"
					htmlFor={inputId}
				>
					Enter your wallet tenant ID
				</label>
				<label className="flex items-center text-lg bg-lm-gray-200 dark:bg-dm-gray-800 border border-lm-gray-400 dark:border-dm-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-lm-gray-700 dark:focus-within:ring-dm-gray-300 cursor-text">
					<span
						className="pl-3 py-2 text-lm-gray-700 dark:text-dm-gray-300 opacity-40 select-none whitespace-nowrap"
						aria-hidden="true"
					>
						id.siros.org/id/
					</span>
					<input
						className="w-full min-w-0 pr-2 py-2 bg-transparent dark:text-white outline-none dark:inputDarkModeOverride"
						type="text"
						id={inputId}
						placeholder="default"
						required
						value={query}
						onChange={(event) => setQuery(event.target.value)}
					/>
					<span className="pr-3 shrink-0">
						<StatusIcon status={status} />
					</span>
				</label>
			</div>
			<Button
				variant="primary"
				className="w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale disabled:hover:brightness-100"
				disabled={status !== 'found'}
				onClick={handleNavigate}
			>
				Go to tenant
			</Button>
			{query !== '' && (
				<p aria-live="polite" className="text-center opacity-75">
					{status === 'checking' && 'Checking...'}
					{status === 'found' && 'Tenant found'}
					{status === 'not-found' && (
						<span>
							Tenant <em>{query}</em> not found
						</span>
					)}
					{status === 'error' && (
						<span className="text-red-500">Could not check tenant. Please try again.</span>
					)}
				</p>
			)}
		</div>
	);
}

function StatusIcon({ status }: { status: SearchStatus }) {
	switch (status) {
		case 'checking':
			return (
				<LoaderCircleIcon
					className="animate-spin text-lm-gray-700 dark:text-dm-gray-300"
					aria-hidden="true"
				/>
			);
		case 'found':
			return <CircleCheckIcon className="text-green-600 dark:text-green-400" aria-hidden="true" />;
		case 'not-found':
			return <CircleQuestionMarkIcon className="text-yellow-500" aria-hidden="true" />;
		case 'error':
			return <CircleXIcon className="text-red-500" aria-hidden="true" />;
		default:
			return <SearchIcon className="text-lm-gray-700 dark:text-dm-gray-300" aria-hidden="true" />;
	}
}
