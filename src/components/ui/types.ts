import type { ComponentProps, ElementType, PropsWithChildren } from 'react';

/**
 * Base properties for UI components.
 */
export type HTMLComponentProps<T extends ElementType> = PropsWithChildren<{
	/**
	 * The HTML element or React component to render as.
	 */
	as?: T;
}> &
	Omit<ComponentProps<T>, 'as' | 'children'>;

/**
 * Class list structure for UI components.
 */
export type ComponentClassList = {
	/**
	 * Array of class names.
	 */
	list: string[];
	/**
	 * Joins the class names into a single string.
	 */
	join: () => string;
	/**
	 * Adds a class name to the list.
	 */
	push: (...classNames: (string | undefined)[]) => void;
};

/**
 * Defines the structure for element style properties
 * including class names and styles.
 */
export type ComponentStyleProperty = {
	/**
	 * List of CSS class names to be applied to the element.
	 */
	classList?: ComponentClassList;
	/**
	 * Map of CSS styles to be applied to the element.
	 */
	styles?: Map<string, string>;
	/**
	 * Optional method to convert styles to a plain object.
	 */
	toProps: () => Record<string, unknown>;
};

export type Spacing =
	| 'none'
	| '1'
	| '2'
	| '3'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| '10'
	| '11'
	| '12';

export type ComponentSpacings =
	| Spacing
	| {
			y?: Spacing;
			x?: Spacing;
			top?: Spacing;
			bottom?: Spacing;
			left?: Spacing;
			right?: Spacing;
	  };

export type ComponentMarginProps = ComponentSpacings;
export type ComponentPaddingProps = ComponentSpacings;

export type ComponentWidthProps = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type ComponentFlexProps = {
	direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
	align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
	justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
	wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
	gap?: Spacing;
	inline?: boolean;
};

export type GridColumns = {
	mobile?: number;
	tablet?: number;
	desktop?: number;
	wideDesktop?: number;
};

export type ComponentGridProps = {
	columns?: 'auto' | number | GridColumns;
	rows?: number;
	justify?:
		| 'start'
		| 'end'
		| 'center'
		| 'stretch'
		| 'space-around'
		| 'space-between'
		| 'space-evenly';
	align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
	gap?: Spacing;
};
