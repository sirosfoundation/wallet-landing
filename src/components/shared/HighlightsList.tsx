import { BadgeCheckIcon, CalendarDaysIcon, IdCardIcon, SquareStarIcon } from 'lucide-react';

const highlights = [
	{ icon: CalendarDaysIcon, text: 'Proof of age' },
	{ icon: IdCardIcon, text: 'Government or organizational ID' },
	{ icon: SquareStarIcon, text: 'Memberships or qualifications' },
	{ icon: BadgeCheckIcon, text: 'Permissions and authorizations' },
];

export default function HighlightsList() {
	return (
		<ul className="my-6 grid lg:grid-cols-2 lg:grid-rows-2 gap-4">
			{highlights.map(({ icon: Icon, text }) => (
				<li key={text} className="flex items-center gap-4 text-sm text-primary dark:text-white">
					<Icon />
					{text}
				</li>
			))}
		</ul>
	);
}
