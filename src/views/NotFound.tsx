import Hero from '../components/shared/Hero';
import Link from '../components/ui/elements/Link';

export default function NotFound() {
	return (
		<div className="grow flex flex-col items-center justify-center px-6 py-8 space-y-8">
			<Hero title="404: Not found" />
			<p className="text-center text-lm-gray-600 dark:text-lm-gray-400">
				The page you are looking for does not exist.
			</p>
			<Link variant="primary" href="/">
				To start page
			</Link>
		</div>
	);
}
