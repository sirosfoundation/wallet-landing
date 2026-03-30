import { LoaderCircle } from 'lucide-react';
import Logo from './Logo';

export default function Spinner() {
	return (
		<div className="flex justify-center items-center h-dvh w-dvw" role="status" aria-label="Loading">
			<div className="relative h-32 w-32">
				<LoaderCircle strokeWidth={1} className="absolute h-32 w-32 rounded-full text-brand-base dark:text-white animate-spin" />
				<div className="absolute inset-0 flex scale-60 items-center justify-center">
					<Logo className="w-32" />
				</div>
			</div>
		</div>
	);
}
