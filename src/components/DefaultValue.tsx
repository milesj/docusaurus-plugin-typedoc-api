import React from 'react';
import { JSONOutput } from 'typedoc';
import { Type } from './Type';

export interface DefaultValueProps {
	type?: JSONOutput.SomeType;
}

export function DefaultValue({ type }: DefaultValueProps) {
	if (type === undefined) {
		return null;
	}

	return (
		<>
			<span className="tsd-signature-symbol"> =</span> <Type type={type} />
		</>
	);
}
