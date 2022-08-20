// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/typeParameters.hbs

import React from 'react';
import type { JSONOutput } from 'typedoc';
import { Comment } from './Comment';
import { DefaultValue } from './DefaultValue';
import { Type } from './Type';

export interface TypeParametersProps {
	params?: JSONOutput.TypeParameterReflection[];
}

export function TypeParameters({ params }: TypeParametersProps) {
	if (!params || params.length === 0) {
		return null;
	}

	return (
		<ul className="tsd-type-parameters">
			{params.map((param) => (
				<li key={param.id}>
					<strong>{param.name}</strong>

					{param.type && (
						<>
							<span className="tsd-signature-symbol">:</span> <Type type={param.type} />
						</>
					)}

					<DefaultValue comment={param.comment} type={param.type} value={param.default} />

					<Comment comment={param.comment} />
				</li>
			))}
		</ul>
	);
}
