import { BadgeCheckIcon, CalendarDaysIcon, IdCardIcon, SquareStarIcon } from 'lucide-react';
import laptopPhoneImage from '../../assets/images/laptop-phone.png';
import Link from '../ui/elements/Link';

const highlights = [
	{ icon: CalendarDaysIcon, text: 'Proof of age' },
	{ icon: IdCardIcon, text: 'Government or organizational ID' },
	{ icon: SquareStarIcon, text: 'Memberships or qualifications' },
	{ icon: BadgeCheckIcon, text: 'Permissions and authorizations' },
];

export default function AboutCard() {
	return (
		<div className="col-span-full grid md:grid-cols-2 relative p-8 gap-y-8 bg-lm-gray-200 dark:bg-dm-gray-800 rounded-lg border border-lm-gray-400 dark:border-dm-gray-600">
			<div className="grid grid-rows-[min-content] space-y-4 md:space-y-6 lg:space-y-8">
				<h2 className="text-2xl font-semibold text-primary dark:text-white">About the SIROS ID Wallet</h2>
				<div className="space-y-1 text-base">
					<p>
						SIROS ID is a digital identity wallet app that lets gives you secure, full control over
						the storage and use of your credentials, such as:
					</p>
					<ul className="my-6 grid lg:grid-cols-2 lg:grid-rows-2 gap-4">
						{highlights.map(({ icon: Icon, text }) => (
							<li
								key={text}
								className="flex items-center gap-4 text-sm text-primary dark:text-white"
							>
								<Icon />
								{text}
							</li>
						))}
					</ul>
					<p>
						Unlike most wallets, SIROS ID Wallet can be used in a web brower or through our native
						apps, or installed as a progressive web app.
					</p>
				</div>
				<div className="s-hide-in-wrapper-app self-end flex items-center gap-4">
					<p>Download:</p>
					<Link variant="link" href="" className="text-primary dark:text-white">
						App Store
					</Link>
					<Link variant="link" href="" className="text-primary dark:text-white">
						Play Store
					</Link>
				</div>
			</div>
			<div className="grid grid-rows-[min-content] pb-0 gap-8 justify-items-center">
				<img
					src={laptopPhoneImage}
					alt="Laptop and phone displaying the SIROS ID Wallet app"
					className="p-4 w-[min(100%,375px)] h-auto object-contain"
				/>
				<Link
					variant="link"
					href="https://siros.org/how-it-works"
					className="self-end text-primary dark:text-white"
				>
					Learn more about "How do wallets work?"
				</Link>
			</div>
		</div>
	);
}
