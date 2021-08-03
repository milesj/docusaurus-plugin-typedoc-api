// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.declaration.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { Comment } from './Comment';
import { MemberSources } from './MemberSources';
import { Type } from './Type';
import { TypeParameters } from './TypeParameters';

export interface MemberDeclarationProps {
	decl: JSONOutput.DeclarationReflection;
}

export function MemberDeclaration({ decl }: MemberDeclarationProps) {
	return (
		<>
			<div className="tsd-signature tsd-kind-icon">
				{decl.name}
				{decl.typeParameter && (
					<>&lt;{decl.typeParameter.map((param) => param.name).join(', ')}&gt;</>
				)}
				<span className="tsd-signature-symbol">
					{decl.flags.isOptional && '?'}: <Type type={decl.type} />
				</span>
				{'defaultValue' in decl && (
					<span className="tsd-signature-symbol">
						&nbsp;=&nbsp;
						{decl.defaultValue}
					</span>
				)}
			</div>

			<MemberSources reflection={decl} />

			<Comment comment={decl.comment} />

			{decl.typeParameter && (
				<div className="tds-type-parameters">
					<h4 className="tsd-type-parameters-title">Type parameters</h4>
					<TypeParameters params={decl.typeParameter} />
				</div>
			)}

			{'TODO declaration'}
		</>
	);
}
