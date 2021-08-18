// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.signature.body.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { useMinimalLayout } from '../hooks/useMinimalLayout';
import { Comment, hasComment } from './Comment';
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

// eslint-disable-next-line complexity
export function MemberSignatureBody({ hideSources, sig }: MemberSignatureBodyProps) {
	const minimal = useMinimalLayout();
	const showParams = !minimal && sig.parameters && sig.parameters.length > 0;
	const showReturn = !minimal && sig.type;
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	const hasFullContent = Boolean(sig.typeParameter || showParams || showReturn);

	return (
		<>
			{!hideSources && <MemberSources reflection={sig} />}

			<Comment comment={sig.comment} />

			{hasComment(sig.comment) && hasFullContent && <hr className="tsd-divider" />}

			{sig.typeParameter && (
				<>
					<h4 className="tsd-type-parameters-title">Type parameters</h4>
					<TypeParameters params={sig.typeParameter} />
				</>
			)}

			{showParams && (
				<>
					<h4 className="tsd-parameters-title">Parameters</h4>

					<ul className="tsd-parameters">
						{sig.parameters?.map((param) => (
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

			{showReturn && (
				<>
					<h4 className="tsd-returns-title">
						Returns <Type type={sig.type} />
					</h4>

					{sig.comment?.returns && <Markdown content={sig.comment.returns} />}

					<Parameter param={sig.type?.declaration} />
				</>
			)}
		</>
	);
}
