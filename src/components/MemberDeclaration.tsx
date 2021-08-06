// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.declaration.hbs

import React from 'react';
import { useDeclaration } from '../hooks/useDeclaration';
import { Comment } from './Comment';
import { MemberSources } from './MemberSources';
import { Type } from './Type';
import { TypeParameters } from './TypeParameters';

export interface MemberDeclarationProps {
	id: number;
}

export function MemberDeclaration({ id }: MemberDeclarationProps) {
	const reflection = useDeclaration(id);

	console.log('MemberDeclaration', id, reflection);

	return (
		<>
			<div className="tsd-signature tsd-kind-icon">
				{reflection.name}
				{reflection.typeParameter && (
					<>&lt;{reflection.typeParameter.map((param) => param.name).join(', ')}&gt;</>
				)}
				<span className="tsd-signature-symbol">
					{reflection.flags?.isOptional && '?'}: <Type type={reflection.type} />
				</span>
				{'defaultValue' in reflection && (
					<span className="tsd-signature-symbol">
						&nbsp;=&nbsp;
						{reflection.defaultValue}
					</span>
				)}
			</div>

			<MemberSources reflection={reflection} />

			<Comment comment={reflection.comment} />

			{reflection.typeParameter && (
				<div className="tds-type-parameters">
					<h4 className="tsd-type-parameters-title">Type parameters</h4>
					<TypeParameters params={reflection.typeParameter} />
				</div>
			)}

			{'TODO declaration'}
		</>
	);
}
