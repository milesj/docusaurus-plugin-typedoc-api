// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/templates/reflection.hbs

import React, { useMemo } from 'react';
import { JSONOutput } from 'typedoc';
import { createHierarchy } from '../utils/hierarchy';
import { Comment, hasComment } from './Comment';
import { Hierarchy } from './Hierarchy';
import { Members } from './Members';
import { MemberSignatures } from './MemberSignatures';
import { Type } from './Type';
import { TypeParameters } from './TypeParameters';

export interface ReflectionProps {
	reflection:
		| JSONOutput.DeclarationReflection
		| JSONOutput.Reflection
		| JSONOutput.SignatureReflection;
}

// TODO:
// - indexSignatures
// - readme
// eslint-disable-next-line complexity
export function Reflection({ reflection }: ReflectionProps) {
	console.log('Reflection', reflection);

	const hierarchy = useMemo(() => createHierarchy(reflection), [reflection]);

	return (
		<>
			{hasComment(reflection.comment) && (
				<section className="tsd-panel tsd-comment">
					<Comment comment={reflection.comment} />
				</section>
			)}

			{'typeParameter' in reflection && reflection.typeParameter.length > 0 && (
				<section className="tsd-panel tsd-type-parameters">
					<h3>Type parameters</h3>
					<TypeParameters params={reflection.typeParameter} />
				</section>
			)}

			{(('extendedBy' in reflection && reflection.extendedBy.length > 0) ||
				('extendedTypes' in reflection && reflection.extendedTypes.length > 0)) && (
				<section className="tsd-panel tsd-hierarchy">
					<h3>Hierarchy</h3>
					<Hierarchy tree={hierarchy} />
				</section>
			)}

			{'implementedTypes' in reflection && reflection.implementedTypes.length > 0 && (
				<section className="tsd-panel tsd-implemented-types">
					<h3>Implements</h3>
					<ul className="tsd-hierarchy">
						{reflection.implementedTypes.map((type) => (
							<li key={type.type}>
								<Type type={type} />
							</li>
						))}
					</ul>
				</section>
			)}

			{'implementedBy' in reflection && reflection.implementedBy.length > 0 && (
				<section className="tsd-panel tsd-implemented-by">
					<h3>Implemented by</h3>
					<ul className="tsd-hierarchy">
						{reflection.implementedBy.map((type) => (
							<li key={type.name}>
								<Type type={type} />
							</li>
						))}
					</ul>
				</section>
			)}

			{'signatures' in reflection && reflection.signatures && (
				<section className="tsd-panel tsd-signatures">
					<h3 className="tsd-before-signature">Callable</h3>
					<MemberSignatures sigs={reflection.signatures} />
				</section>
			)}

			{/* indexSignature */}

			{/* README */}

			<Members reflection={reflection} />
		</>
	);
}
