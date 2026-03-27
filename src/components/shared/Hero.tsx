import Logo from './Logo';

export type HeroProps = {
	title?: string;
};

export default function Hero({ title }: HeroProps) {
	return (
		<>
			<a href="/" className="mb-6" aria-label="SIROS ID Wallet">
				<Logo className="w-20" />
			</a>
			<h1 className="text-3xl mb-8 font-bold leading-tight tracking-tight text-lm-gray-900 text-center dark:text-white">
				{title || (
					<>
						Welcome to <span className="text-primary dark:text-brand-light">SIROS ID Wallet</span>
					</>
				)}
			</h1>
		</>
	);
}
