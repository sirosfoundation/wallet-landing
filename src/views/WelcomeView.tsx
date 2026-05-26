import { type FC, useMemo } from 'react';
import AboutCard from '../components/cards/AboutCard';
import InfoCard, { type InfoCardProps } from '../components/cards/InfoCard';
import Hero from '../components/shared/Hero';
import HighlightsList from '../components/shared/HighlightsList';
import Link from '../components/ui/elements/Link';
import useScreenType from '../hooks/useScreenType';

export default function WelcomeView() {
	const isNative =
		document.body.classList.contains('is-wrapper-app') &&
		'nativeWrapper' in window &&
		window.nativeWrapper !== null;
	return isNative ? <NativeWelcomeView /> : <BrowserWelcomeView />;
}

function NativeWelcomeView() {
	return (
		<div className="grow flex flex-col items-center justify-center px-6 py-8">
			<Hero />
			<div className="space-y-2">
				<p>
					SIROS ID is a digital identity wallet app that lets you store and use digital credentials,
					such as:
				</p>
				<HighlightsList />
				<h2 className="text-xl font-semibold">Create a wallet account</h2>
				<p>
					The SIROS ID wallet is in beta. Create an account to test out how the technology works.
				</p>
			</div>
			<div className="mt-6 space-y-4">
				<Link href="/id/default?mode=signup" variant="primary" className="mt-4">
					Get started
				</Link>
				<p className="text-primary dark:text-white">
					Already have an account?{' '}
					<Link href="/id/default/login" variant="link" className="text-primary dark:text-white">
						Log in
					</Link>
					.
				</p>
			</div>
		</div>
	);
}

type InfoCardItem = InfoCardProps & {
	Component: FC<InfoCardProps>;
};

type AboutCardItem = typeof AboutCard;

type CardsList = (InfoCardItem | AboutCardItem)[];

const cardsList: CardsList = [
	{
		Component: InfoCard,
		title: 'Create a wallet account',
		body: (
			<>
				<h3 className="font-semibold">Have an invitation link?</h3>
				<p>
					Click on the invitation link sent to you to create a wallet account. If you do not have a
					link contact your wallet provider.
				</p>
				<h3 className="mt-4 font-semibold">Test the SIROS ID Wallet</h3>
				<p>
					The SIROS ID wallet is in Beta. Create an account to test out how the technology works.
				</p>
			</>
		),
		actions: (
			<>
				<Link href="/id/default">Continue</Link>
				<span className="text-primary dark:text-white">
					Already have an account?{' '}
					<Link href="/id/default/login" variant="link" className="text-inherit">
						Log in
					</Link>
				</span>
			</>
		),
	},
	{
		Component: InfoCard,
		title: 'Develop with the SIROS ID Platform',
		body: (
			<>
				<p>
					Are you an organization interested in using components of the SIROS ID platform and
					digital identity ecosystem? Use our Issuer, Wallet, Verifier, or trust framework to
					complement your solution, or explore our hosted or on prem solutions.
				</p>
				<Link
					variant="link"
					href="https://developers.siros.org"
					className="text-primary dark:text-white"
				>
					Learn more
				</Link>
			</>
		),
		actions: (
			<>
				<Link href="https://siros.org/contact">Contact Us</Link>
			</>
		),
	},
];

function BrowserWelcomeView() {
	const screenType = useScreenType();

	const cards = useMemo(() => {
		const ordered = [...cardsList];
		ordered.splice(screenType === 'desktop' ? 2 : 1, 0, AboutCard);
		return ordered;
	}, [screenType]);

	return (
		<div className="grow flex flex-col items-center justify-center pt-36 px-6 py-8">
			<Hero />
			<div className="mt-8 grid md:grid-cols-2 w-[min(100%,1200px)] gap-x-12 gap-y-8">
				{cards.map((card) => {
					if (typeof card === 'function') {
						const Component = card;
						return <Component key={card.name} />;
					} else {
						const { Component, ...props } = card;
						return <Component key={props.title} {...props} />;
					}
				})}
			</div>
		</div>
	);
}
