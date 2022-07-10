// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.signature.body.hbs

import React from 'react';
import type { JSONOutput } from 'typedoc';
import { useMinimalLayout } from '../hooks/useMinimalLayout';
import { Comment, hasComment } from './Comment';
import { DefaultValue } from './DefaultValue';
import { Flags } from './Flags';
import { hasSources, MemberSources } from './MemberSources';
import { Parameter } from './Parameter';
import { Type } from './Type';
import { TypeParameters } from './TypeParameters';

export function hasSigBody(
	sig: JSONOutput.SignatureReflection | undefined,
	minimal: boolean,
	hideSources: boolean = false,
) {
	if (!sig) {
		return false;
	}

	return (
		(!hideSources && hasSources(sig)) ||
		hasComment(sig.comment) ||
		(sig.typeParameter && sig.typeParameter.length > 0) ||
		(!minimal && sig.parameters && sig.parameters.length > 0) ||
		(!minimal && sig.type)
	);
}

export interface MemberSignatureBodyProps {
	hideSources?: boolean;
	sig: JSONOutput.SignatureReflection;
}

// eslint-disable-next-line complexity
export function MemberSignatureBody({ hideSources, sig }: MemberSignatureBodyProps) {
	const minimal = useMinimalLayout();
	const showTypes = sig.typeParameter && sig.typeParameter.length > 0;
	const showParams = !minimal && sig.parameters && sig.parameters.length > 0;
	const showReturn = !minimal && sig.type;

	return (
		<>
			{!hideSources && <MemberSources reflection={sig} />}

			<Comment comment={sig.comment} />

			{hasComment(sig.comment) && (showTypes || showParams || showReturn) && (
				<hr className="tsd-divider" />
			)}

			{showTypes && (
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

					<Comment comment={sig.comment} />

					<Parameter param={sig.type?.declaration} />
				</>
			)}
		</>
	);
}
