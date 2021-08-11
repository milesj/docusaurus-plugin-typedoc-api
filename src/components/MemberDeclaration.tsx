// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.declaration.hbs

import React from 'react';
import { useReflection } from '../hooks/useReflection';
import { Comment } from './Comment';
import { DefaultValue } from './DefaultValue';
import { Icon } from './Icon';
import { MemberSources } from './MemberSources';
import { Parameter } from './Parameter';
import { Type } from './Type';
import { TypeParameters } from './TypeParameters';
import { TypeParametersGeneric } from './TypeParametersGeneric';

export interface MemberDeclarationProps {
	id: number;
}

export function MemberDeclaration({ id }: MemberDeclarationProps) {
	const reflection = useReflection(id)!;

	return (
		<>
			<div className="tsd-panel-content">
				<div className="tsd-signature tsd-kind-icon">
					<Icon reflection={reflection} />
					{reflection.name}
					<TypeParametersGeneric params={reflection.typeParameter} />
					<span className="tsd-signature-symbol">{reflection.flags?.isOptional && '?'}: </span>{' '}
					<Type type={reflection.type} />
					<DefaultValue type={reflection.defaultValue} />
				</div>
			</div>

			<div className="tsd-panel-content">
				<MemberSources reflection={reflection} />

				<Comment comment={reflection.comment} />

				{reflection.typeParameter && (
					<div className="tds-type-parameters">
						<h4 className="tsd-type-parameters-title">Type parameters</h4>
						<TypeParameters params={reflection.typeParameter} />
					</div>
				)}

				{reflection.type?.declaration && (
					<div className="tsd-type-declaration">
						<h4>Type declaration</h4>
						<Parameter param={reflection.type.declaration} />
					</div>
				)}
			</div>
		</>
	);
}
