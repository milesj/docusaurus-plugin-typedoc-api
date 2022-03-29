import React from 'react';
import type { JSONOutput } from 'typedoc';

export interface TypeParametersGenericProps {
	params?: JSONOutput.TypeParameterReflection[];
}

export function TypeParametersGeneric({ params }: TypeParametersGenericProps) {
	if (!params || params.length === 0) {
		return null;
	}

	return (
		<span className="tsd-generics">
			<span className="tsd-signature-symbol">&lt;</span>
			{params.map((param, i) => (
				<React.Fragment key={param.id}>
					{i > 0 && <span className="tsd-signature-symbol">, </span>}
					{param.name}
				</React.Fragment>
			))}
			<span className="tsd-signature-symbol">&gt;</span>
		</span>
	);
}
