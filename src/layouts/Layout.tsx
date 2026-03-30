export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="content-fade-in-appear-done content-fade-in-enter-done">
			<div className="bg-lm-gray-100 dark:bg-dm-gray-900 min-h-dvh flex flex-col">
				{children}
				<footer className="py-4">
					<p className="text-sm text-lm-gray-800 dark:text-dm-gray-200 text-center">
						Powered by{' '}
						<a
							href="https://developers.siros.org"
							rel="noreferrer"
							target="_blank"
							className="underline font-semibold text-lm-gray-800 dark:text-dm-gray-300"
						>
							SIROS ID
						</a>
					</p>
				</footer>
			</div>
		</div>
	);
}
