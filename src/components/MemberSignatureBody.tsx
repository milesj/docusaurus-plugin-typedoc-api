// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.signature.body.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { Comment } from './Comment';
import { DefaultValue } from './DefaultValue';
import { Flags } from './Flags';
import { Markdown } from './Markdown';
import { MemberSources } from './MemberSources';
import { Parameter } from './Parameter';
import { Type } from './Type';
import { TypeParameters } from './TypeParameters';

export interface MemberSignatureBodyProps {
	hideSources?: boolean;
	sig: JSONOutput.SignatureReflection;
}

export function MemberSignatureBody({ hideSources, sig }: MemberSignatureBodyProps) {
	return (
		<>
			{!hideSources && <MemberSources reflection={sig} />}

			<Comment comment={sig.comment} />

			{sig.typeParameter && (
				<>
					<h4 className="tsd-type-parameters-title">Type parameters</h4>
					<TypeParameters params={sig.typeParameter} />
				</>
			)}

			{sig.parameters && (
				<>
					<h4 className="tsd-parameters-title">Parameters</h4>

					<ul className="tsd-parameters">
						{sig.parameters.map((param) => (
							<li key={param.id}>
								<h5>
									<Flags flags={param.flags} />

									{param.flags?.isRest && <span className="tsd-signature-symbol">...</span>}

									{`${param.name}: `}

									<Type type={param.type} />

									<DefaultValue type={param.defaultValue} />
								</h5>

								<Comment comment={param.comment} />
							</li>
						))}
					</ul>
				</>
			)}

			{sig.type && (
				<>
					<h4 className="tsd-returns-title">
						Returns <Type type={sig.type} />
					</h4>

					{sig.comment?.returns && <Markdown content={sig.comment.returns} />}

					<Parameter param={sig.type.declaration} />
				</>
			)}
		</>
	);
}
