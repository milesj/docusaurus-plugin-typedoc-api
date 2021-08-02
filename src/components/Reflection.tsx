// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/templates/reflection.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { Comment, hasComment } from './Comment';
import { TypeParameters } from './TypeParameters';

export interface ReflectionProps {
	reflection:
		| JSONOutput.DeclarationReflection
		| JSONOutput.Reflection
		| JSONOutput.SignatureReflection;
}

export function Reflection({ reflection }: ReflectionProps) {
	return (
		<>
			{hasComment(reflection.comment) && (
				<section className="tsd-panel tsd-comment">
					<Comment comment={reflection.comment} />
				</section>
			)}

			{'typeParameter' in reflection && reflection.typeParameter && (
				<section className="tsd-panel tsd-type-parameters">
					<h3>Type parameters</h3>
					<TypeParameters params={reflection.typeParameter} />
				</section>
			)}
		</>
	);
}
