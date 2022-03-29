// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/typeAndParent.hbs

import React from 'react';
import type { JSONOutput } from 'typedoc';
import { Type } from './Type';

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

	return <Type type={type} />;
}
