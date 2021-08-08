// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/typeParameters.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { Comment } from './Comment';
import { DefaultValue } from './DefaultValue';
import { Type } from './Type';

export interface TypeParametersProps {
	params: JSONOutput.TypeParameterReflection[];
}

export function TypeParameters({ params }: TypeParametersProps) {
	return (
		<ul className="tsd-type-parameters">
			{params.map((param) => (
				<li key={param.id}>
					<h4>
						{param.name}

						{param.type && (
							<>
								<span className="tsd-signature-symbol">:</span> <Type type={param.type} />
							</>
						)}

						<DefaultValue type={param.default} />
					</h4>

					<Comment comment={param.comment} />
				</li>
			))}
		</ul>
	);
}
