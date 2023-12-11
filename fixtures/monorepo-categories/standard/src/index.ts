/**
 * a type
 * @beta
 */
export type Type = 'standard';

/**
 * short description
 *
 * long description with a link to {@link bizz}. did it work?
 * what about our own tokens: {@apilink Foo} and {@doclink intro}!
 * and some inline `code`???
 *
 * ```
 * let dontForget = 'block code';
 * ```
 *
 * @param {String} msg description
 * @param other without type
 * @returns returns the param
 */
export function comments(msg: string, other: boolean) {}

/**
 * newy new guy
 * @param a a thing
 * @param b b thing
 * @alpha
 */
export function bizz(a: string, b: string): string;

/**
 * newy new guy
 * @param a a thing
 * @param b b thing
 * @param c c thing
 * @beta
 */
export function bizz(a: string, b: string, c: string): string;

/**
 * a thing for a thing
 * @param a id
 * @returns returns the param
 * @beta
 */
export function bizz(...args: string[]): string {
	return args[0];
}

/**
 * @param {string} [a] thing
 * @param {string} [b="b"] thing
 * @param {string} [c="c override"] thing
 */
export function defs(a?: string, b?: string, c: string = 'c') {}

/**
 * thing for a thing
 * @beta
 */
export interface Foo {
	/**
	 * very experimental
	 * @alpha
	 * @default "foo"
	 */
	foo: string;

	/**
	 * very experimental
	 * @experimental
	 */
	a: string;

	/**
	 * @default 123
	 */
	int?: number;
}

/**
 * :::
 * standard
 * :::
 *
 * :::note
 * with type
 * :::
 *
 * ::: title
 * title only
 * :::
 *
 * :::info title
 * with type
 *
 * and title
 * :::
 *
 * :::success
 *
 * extra new lines
 *
 * :::
 */
export function admonitions() {}

/**
 * @throws something
 */
export function errors() {}
