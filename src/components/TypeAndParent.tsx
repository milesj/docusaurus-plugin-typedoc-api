// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/typeAndParent.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';

export interface TypeAndParentProps {
	type?: JSONOutput.SomeType;
}

export function TypeAndParent({ type }: TypeAndParentProps) {
	if (!type) {
		return <>void</>;
	}

	if ('elementType' in type && type.elementType) {
		return (
			<>
				<TypeAndParent type={type.elementType} />
				[]
			</>
		);
	}

	// @ts-expect-error TODO
	if ('reflection' in type && type.reflection) {
		return <>TODO reflection?</>;
	}

	return null;
}
