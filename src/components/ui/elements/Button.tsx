import type { LucideIcon } from 'lucide-react';
import type { HTMLComponentProps } from '../types';

type AllowedElements = 'a' | 'button';

export type ButtonVariant = 'primary' | 'default' | 'danger' | 'link';

export type ButtonProps<T extends AllowedElements = 'button'> = HTMLComponentProps<T> & {
	variant?: ButtonVariant;
	square?: boolean;
	icon?:
		| LucideIcon
		| {
				left?: LucideIcon;
				right?: LucideIcon;
		  };
};

export default function Button<T extends AllowedElements = 'button'>({
	as,
	children,
	className,
	variant = 'default',
	square,
	icon,
	...props
}: ButtonProps<T>) {
	const Component = as ?? 'button';
	let IconLeft: LucideIcon | undefined;
	let IconRight: LucideIcon | undefined;

	const classList = [
		'rounded-lg shadow-xs text-center font-medium flex flex-row flex-nowrap items-center justify-center gap-2 border transition-color duration-150',
		'hover:cursor-pointer hover:brightness-[0.85] dark:hover:brightness-[1.15]',
		square ? 'p-2' : 'px-4 py-2',
	];

	if (variant !== 'link') classList.unshift('button');

	if (variant === 'primary') {
		classList.push('text-white bg-primary border-primary');
	} else if (variant === 'danger') {
		classList.push(
			'text-lm-red-light dark:text-dm-red-light bg-lm-red-dark dark:bg-dm-red-dark border-lm-red-dark dark:border-dm-red-dark',
		);
	} else if (variant === 'link') {
		classList.splice(0, classList.length);
		classList.push('underline', 'cursor-pointer hover:decoration-2 transition');
	} else {
		classList.push(
			'text-lm-gray-900 dark:text-white bg-lm-gray-200 dark:bg-dm-gray-800 border-lm-gray-700 dark:border-dm-gray-400',
		);
	}

	if (className) classList.push(className);

	// if (square) classList.push(style.square);

	if (icon && 'left' in icon) IconLeft = icon.left;
	if (icon && 'right' in icon) IconRight = icon.right;
	if (icon && !IconLeft && !IconRight) IconLeft = icon as LucideIcon;

	// Since T is a generic type, props cannot be directly passed to Component without casting
	return (
		<Component className={classList.join(' ')} {...(props as any)}>
			{IconLeft && <IconLeft size="1em" />}
			{children}
			{IconRight && <IconRight size="1em" />}
		</Component>
	);
}
