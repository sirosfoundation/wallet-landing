import { useMemo, type FC } from 'react';
import useScreenType from '../hooks/useScreenType';
import Link from '../components/ui/elements/Link';
import InfoCard, { type InfoCardProps } from '../components/cards/InfoCard';
import AboutCard from '../components/cards/AboutCard';
import Hero from '../components/shared/Hero';

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
					Aready have a account?{' '}
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
					digital identify ecosystem? Use our Issuer, Wallet, Verifier, or trust framework to
					compliment your solution, or explore our hosted or on prem solutions.
				</p>
				<Link variant="link" href="https://developers.siros.org" className="text-primary dark:text-white">
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

export default function WelcomeView() {
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
				{cards.map((card, index) => {
					if (typeof card === 'function') {
						const Component = card;
						return <Component key={index} />;
					} else {
						const { Component, ...props } = card;
						return <Component key={props.title} {...props} />;
					}
				})}
			</div>
		</div>
	);
}
