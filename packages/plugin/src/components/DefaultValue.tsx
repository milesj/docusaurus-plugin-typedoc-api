import React from 'react';
import type { JSONOutput } from 'typedoc';
import { Type } from './Type';

export interface DefaultValueProps {
	type?: JSONOutput.SomeType | string;
}

export function DefaultValue({ type }: DefaultValueProps) {
	if (type === undefined) {
		return null;
	}

	return (
		<span className="tsd-signature-symbol">
			{' = '}
			{typeof type === 'string' ? type : <Type type={type} />}
		</span>
	);
}
