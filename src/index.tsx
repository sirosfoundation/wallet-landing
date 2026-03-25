import { createRoot } from 'react-dom/client';
import { resolveInitialRoute } from './lib/routing';
import { getCachedUsers, getKnownTenants } from './lib/tenant';
import { renderView } from './views';

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
		const View = renderView(route.view, route.props);
		root.render(View);
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
