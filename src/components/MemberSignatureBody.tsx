// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.signatures.hbs
// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.signature.title.hbs
// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.signature.body.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { Comment } from './Comment';
import { Flags } from './Flags';
import { Markdown } from './Markdown';
import { Type } from './Type';
import { TypeParameters } from './TypeParameters';

export interface MemberSignatureBodyProps {
	sig: JSONOutput.SignatureReflection;
}

export function MemberSignatureBody({ sig }: MemberSignatureBodyProps) {
	return (
		<>
			{'TODO sources'}

			<Comment comment={sig.comment} />

			{sig.typeParameter && <TypeParameters params={sig.typeParameter} />}

			{sig.parameters && (
				<>
					<h4 className="tsd-parameters-title">Parameters</h4>
					<ul className="tsd-parameters">
						{sig.parameters.map((param) => (
							<li key={param.id}>
								<h5>
									<Flags flags={param.flags} />

									{param.flags.isRest && <span className="tsd-signature-symbol">...</span>}

									{`${param.name}: `}

									<Type type={param.type} />

									{'defaultValue' in param && (
										<span className="tsd-signature-symbol"> = {param.defaultValue}</span>
									)}
								</h5>

								<Comment comment={param.comment} />

								{'TODO declaration'}
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

					{'TODO declaration'}
				</>
			)}
		</>
	);
}
