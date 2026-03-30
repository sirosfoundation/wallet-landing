import { StrictMode, Suspense } from 'react';
import Spinner from './components/shared/Spinner';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './layouts/Layout';
import { renderView, type ViewMap } from './views';

export type AppProps<V extends keyof ViewMap> = {
	view: V;
	props: ViewMap[V];
};

export default function App<V extends keyof ViewMap>({ view, props }: AppProps<V>) {
	return (
		<StrictMode>
			<ThemeProvider>
				<Layout>
					<Suspense fallback={<Spinner />}>
						{renderView(view, props)}
					</Suspense>
				</Layout>
			</ThemeProvider>
		</StrictMode>
	);
}
