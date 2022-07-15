export type Type = 'standard';

/**
 * a thing for a thing
 * @param a id
 * @returns returns the param
 * @beta
 */
export function bizz(a: string): string {
	return a;
}

/**
 * thing for a thing
 * @beta
 */
export interface Foo {
	/**
	 * very experimental
	 * @alpha
	 */
	foo: string;

	/**
	 * very experimental
	 * @experimental
	 */
	a: string;
}
