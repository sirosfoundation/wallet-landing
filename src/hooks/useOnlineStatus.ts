import { useSyncExternalStore } from 'react';

export type OnlineStatus =
	| { online: true }
	| { online: false; reason: 'no-network' | 'unreachable' };

let status: OnlineStatus = navigator.onLine
	? { online: true }
	: { online: false, reason: 'no-network' };

function subscribe(callback: () => void) {
	const setOnline = () => {
		status = { online: true };
		callback();
	};
	const setOffline = () => {
		status = { online: false, reason: 'no-network' };
		callback();
	};
	const onMessage = (event: MessageEvent<SWMessage>) => {
		if (event.data?.type === 'connectivity') {
			status = event.data.online ? { online: true } : { online: false, reason: 'unreachable' };
			callback();
		}
	};

	window.addEventListener('online', setOnline);
	window.addEventListener('offline', setOffline);
	navigator.serviceWorker?.addEventListener('message', onMessage);

	return () => {
		window.removeEventListener('online', setOnline);
		window.removeEventListener('offline', setOffline);
		navigator.serviceWorker?.removeEventListener('message', onMessage);
	};
}

function getSnapshot() {
	return status;
}

export function useOnlineStatus() {
	return useSyncExternalStore(subscribe, getSnapshot);
}
