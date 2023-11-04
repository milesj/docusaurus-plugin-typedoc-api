// https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/120

/**
 * Module interface for values that have equivalence relation
 */
export interface Equal<T> {
	/**
	 * Alias to '=='
	 *
	 * @example
	 * ```ts
	 * type T = // ...
	 * const TEqual: Equal<T>;
	 * TEqual.equals(value, value); // true
	 * TEqual.equals(value, otherValue); // false
	 * ```
	 * @category Comparator
	 */
	equals(this: void, left: T, right: T): boolean;
	/**
	 * "Not equal to" operator
	 *
	 * @example
	 * ```ts
	 * const TEqual: Equal<T>;
	 * TEqual['!='](value, otherValue); // true
	 * TEqual['!='](value, value); // false
	 * ```
	 * @category Comparator
	 */
	'!='(this: void, left: T, right: T): boolean;
	/**
	 * "Equal to" operator
	 *
	 * @example
	 * ```ts
	 * type T = // ...
	 * const TEqual: Equal<T>;
	 * TEqual['=='](value, value); // true
	 * TEqual['=='](value, otherValue); // false
	 * ```
	 * @category Comparator
	 */
	'=='(this: void, left: T, right: T): boolean;
}

/**
 * Equal module constructor
 *
 * @example
 * ```ts
 * type T;
 * const TEqual = Equal<T>({
 *   '==': (left, right) => { /* ... *\/ },
 * });
 * const value: T;
 *
 * TEqual['=='](value, value); // true;
 * ```
 * @category Functor
 */
export function Equal<T>(properties: { equals: (left: T, right: T) => boolean }): Equal<T> {
	const equals = (left: T, right: T) => properties.equals(left, right);
	const notEquals = (left: T, right: T) => !properties.equals(left, right);
	return {
		equals: properties.equals,
		'==': equals,
		'!=': notEquals,
	};
}

/**
 * Module interface for values that have total order
 */
export interface Comparable<T> extends Equal<T> {
	/**
	 * Return a number that represents comparison
	 *
	 * @example
	 * ```ts
	 * type T;
	 * const TCompare: Comparable<T>;
	 * const sorted = [3, 1, 1].sort(TCompare.compare);
	 * ```
	 * @category Comparator
	 */
	compare(this: void, left: T, right: T): number;
	/**
	 * "Less than or equal to" operator
	 *
	 * @example
	 * ```ts
	 * type T;
	 * const TCompare: Comparable<T>;
	 * const smallerT: T;
	 * const greaterT: T;
	 * TCompare['<='](smallerT, smallerT); // true
	 * TCompare['<='](smallerT, greaterT); // true
	 * TCompare['<='](greaterT, smallerT); // false
	 * ```
	 * @category Comparator
	 */
	'<='(this: void, left: T, right: T): boolean;
	/**
	 * "Less than" operator
	 *
	 * @example
	 * ```ts
	 * type T;
	 * const TCompare: Comparable<T>;
	 * const smallerT: T;
	 * const greaterT: T;
	 * TCompare['<'](smallerT, smallerT); // false
	 * TCompare['<'](smallerT, greaterT); // true
	 * TCompare['<'](greaterT, smallerT); // false
	 * ```
	 * @category Comparator
	 */
	'<'(this: void, left: T, right: T): boolean;
	/**
	 * "Greater than or equal to" operator
	 *
	 * @example
	 * ```ts
	 * type T;
	 * const TCompare: Comparable<T>;
	 * const smallerT: T;
	 * const greaterT: T;
	 * TCompare['>='](smallerT, smallerT); // true
	 * TCompare['>='](smallerT, greaterT); // false
	 * TCompare['>='](greaterT, smallerT); // true
	 * ```
	 * @category Comparator
	 */
	'>='(this: void, left: T, right: T): boolean;
	/**
	 * "Greater than" operator
	 *
	 * @example
	 * ```ts
	 * type T;
	 * const TCompare: Comparable<T>;
	 * const smallerT: T;
	 * const greaterT: T;
	 * TCompare['>'](smallerT, smallerT); // false
	 * TCompare['>'](smallerT, greaterT); // false
	 * TCompare['>'](greaterT, smallerT); // true
	 * ```
	 * @category Comparator
	 */
	'>'(this: void, left: T, right: T): boolean;
	/**
	 * "minimum" operator
	 *
	 * @example
	 * ```ts
	 * type T;
	 * const TCompare: Comparable<T>;
	 * const smallerT: T;
	 * const greaterT: T;
	 * TCompare.min(smallerT, greaterT); // smallerT
	 * ```
	 * @category Comparator
	 */
	min(this: void, left: T, right: T): T;
	/**
	 * "maximum" operator
	 *
	 * @example
	 * ```ts
	 * type T;
	 * const TCompare: Comparable<T>;
	 * const smallerT: T;
	 * const greaterT: T;
	 * TCompare.max(smallerT, greaterT); // greaterT
	 * ```
	 * @category Comparator
	 */
	max(this: void, left: T, right: T): T;
}

/**
 * Construct Comparable instance
 *
 * @example
 * ```ts
 * const NumberComparable = Comparable({
 *   compare: (left, right) => left - right,
 * });
 * NumberComparable['=='](0, 0); // true
 * NumberComparable['<'](0, 1); // true
 * NumberComparable['>'](0, 1); // false
 * ```
 * @category Functor
 * @param properties
 * @param properties.compare - the comparison function
 */
export function Comparable<T>(properties: {
	compare: (left: T, right: T) => number;
}): Comparable<T> {
	const { compare } = properties;
	const equals = (left: T, right: T) => compare(left, right) === 0;
	return {
		compare,
		equals,
		'==': equals,
		'!=': (left: T, right: T) => compare(left, right) !== 0,
		'<': (left: T, right: T) => compare(left, right) < 0,
		'<=': (left: T, right: T) => compare(left, right) <= 0,
		'>': (left: T, right: T) => compare(left, right) > 0,
		'>=': (left: T, right: T) => compare(left, right) >= 0,
		min: (left: T, right: T) => (compare(left, right) <= 0 ? left : right),
		max: (left: T, right: T) => (compare(left, right) > 0 ? left : right),
	};
}

const BooleanComparable = Comparable<boolean>({
	compare(left, right) {
		return left === right ? 0 : left < right ? -1 : 1;
	},
});

/**
 * A collection of functions to manipulate `boolean`
 *
 * @example
 * ```typescript
 * import { Boolean } from '@w5s/core';
 *
 * if (Boolean.hasInstance(unknownValue)) {
 *   // typeof unknownValue === 'boolean'
 * }
 * ```
 * @namespace
 */
export const Boolean = {
	...BooleanComparable,

	/**
	 * Return true if `anyValue` is a `boolean`
	 *
	 * @example
	 * ```typescript
	 * Boolean.hasInstance(false) // true
	 * Boolean.hasInstance(null)) // false
	 * ```
	 * @category Guard
	 * @param anyValue - a tested value
	 */
	hasInstance(anyValue: unknown): anyValue is boolean {
		return typeof anyValue === 'boolean';
	},
};
