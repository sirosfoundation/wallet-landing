import { useMemo } from 'react';
import LogoDark from '../../assets/logo/logo_dark.svg';
import LogoLight from '../../assets/logo/logo_light.svg';
import { useTheme } from '../../hooks/useTheme';

export type LogoProps = {
	className?: string;
};

export default function Logo({ className }: LogoProps) {
	const { theme } = useTheme();
	const logoUrl = useMemo(() => (theme === 'dark' ? LogoDark : LogoLight), [theme]);

	return <img src={logoUrl} alt="SIROS ID Wallet" className={className} />;
}
