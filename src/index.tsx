import { createRoot } from 'react-dom/client';
import { resolveInitialRoute } from './lib/routing';
import { getCachedUsers, getKnownTenants } from './lib/tenant';

import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import './styles/theme.css';
import './styles/index.css';
import App from './App';

const el = document.getElementById('root');
if (!el) {
	throw new Error("Root element with id 'root' not found");
}

const root = createRoot(el);
const cachedUsers = getCachedUsers();
const knownTenants = getKnownTenants(cachedUsers);

const route = resolveInitialRoute(window.location.pathname, knownTenants);

switch (route.type) {
	case 'redirect':
		window.location.href = route.url;
		break;
	case 'render':
		root.render(<App view={route.view} props={route.props} />);
		break;
	case 'error':
		root.render(
			<div>
				<h1>Fatal Error</h1>
				<p>{route.message}</p>
			</div>,
		);
		break;
}

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js');
	});
}
