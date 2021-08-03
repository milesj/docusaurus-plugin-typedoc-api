// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/templates/reflection.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { Comment, hasComment } from './Comment';
import { Type } from './Type';
import { TypeParameters } from './TypeParameters';

export interface ReflectionProps {
	reflection:
		| JSONOutput.DeclarationReflection
		| JSONOutput.Reflection
		| JSONOutput.SignatureReflection;
}

// Doesnt exist in JSON:
// - typeHierarchy
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

			{'implementedTypes' in reflection && reflection.implementedTypes && (
				<section className="tsd-panel tsd-implemented-types">
					<h3>Implements</h3>
					<ul className="tsd-hierarchy">
						{reflection.implementedTypes.map((type) => (
							<li>
								<Type type={type} />
							</li>
						))}
					</ul>
				</section>
			)}

			{'implementedBy' in reflection && reflection.implementedBy && (
				<section className="tsd-panel tsd-implemented-by">
					<h3>Implemented by</h3>
					<ul className="tsd-hierarchy">
						{reflection.implementedBy.map((type) => (
							<li>
								<Type type={type} />
							</li>
						))}
					</ul>
				</section>
			)}

			{'signatures' in reflection && reflection.signatures && (
				<section className="tsd-panel tsd-signatures">
					<h3 className="tsd-before-signature">Callable</h3>
				</section>
			)}
		</>
	);
}
