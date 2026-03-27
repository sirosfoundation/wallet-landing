import { createContext, useEffect, useState } from 'react';

type ThemeContextType = {
	theme: 'light' | 'dark';
};

export const ThemeContext = createContext<ThemeContextType>({
	theme: 'light',
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	const [theme, setTheme] = useState<ThemeContextType['theme']>(
		mediaQuery.matches ? 'dark' : 'light',
	);

	useEffect(() => {
		applyTheme(mediaQuery.matches);

		const handler = (e: MediaQueryListEvent) => {
			applyTheme(e.matches);
			setTheme(e.matches ? 'dark' : 'light');
		};

		mediaQuery.addEventListener('change', handler);

		return () => mediaQuery.removeEventListener('change', handler);
	}, []);

	return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};

function applyTheme(dark: boolean) {
	const root = document.documentElement;
	root.classList.toggle('dark', dark);
	root.setAttribute('data-theme', dark ? 'dark' : 'light');
	root.style.colorScheme = dark ? 'dark' : 'light';
}
