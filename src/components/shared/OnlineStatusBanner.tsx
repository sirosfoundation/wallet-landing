import { useEffect, useState } from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

type BannerState = 'hidden' | 'offline' | 'recovered';

export default function OnlineStatusBanner() {
	const status = useOnlineStatus();
	const [banner, setBanner] = useState<BannerState>('hidden');

	useEffect(() => {
		if (!status.online) {
			setBanner('offline');
			return;
		}

		setBanner(
			(prev) => (prev === 'offline' ? 'recovered' : 'hidden')
		);
	}, [status]);

	useEffect(() => {
		if (banner !== 'recovered') return;

		const timer = setTimeout(
			() => setBanner('hidden'),
			1500
		);

		return () => clearTimeout(timer);
	}, [banner]);

	if (banner === 'hidden') return null;

	const message = status.online
		? 'Back online'
		: status.reason === 'unreachable'
			? 'Unable to connect to the server'
			: 'You are offline';

	const colorClasses = status.online
		? 'bg-lm-green-bg text-white dark:bg-dm-green-bg'
		: 'bg-lm-gray-600 text-lm-gray-900 dark:bg-dm-gray-400 dark:text-dm-gray-100';

	return (
		<div role="alert" className={`py-1 px-4 text-center text-sm font-semibold ${colorClasses}`}>
			{message}
		</div>
	);
}
