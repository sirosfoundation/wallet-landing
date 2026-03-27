import type { ReactNode } from 'react';

export type InfoCardProps = {
	title: string;
	body: ReactNode;
	actions: ReactNode;
};

export default function InfoCard({ title, body, actions }: InfoCardProps) {
	return (
		<div className="@container relative grid grid-rows-[min-content] p-8 space-y-4 md:space-y-6 lg:space-y-8 bg-white rounded-lg dark:bg-dm-gray-900 border border-lm-gray-400 dark:border-dm-gray-600">
			<h2 className="text-2xl font-semibold">{title}</h2>
			<div className="space-y-1 text-base">{body}</div>
			<div className="@md:flex items-center gap-4 space-y-4 @md:space-y-0 self-end">{actions}</div>
		</div>
	);
}
