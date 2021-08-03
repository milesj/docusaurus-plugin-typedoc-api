/* eslint-disable no-nested-ternary */
// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.signature.title.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { Type } from './Type';

export interface MemberSignatureTitleProps {
	hideName?: boolean;
	sig: JSONOutput.SignatureReflection;
}

export function MemberSignatureTitle({ hideName, sig }: MemberSignatureTitleProps) {
	return (
		<>
			{hideName ? (
				sig.name
			) : sig.kindString === 'Constructor signature' ? (
				<>
					{sig.flags.isAbstract && <span className="tsd-signature-symbol">abstract </span>}
					<span className="tsd-signature-symbol">new </span>
				</>
			) : null}

			{sig.typeParameter && (
				<span>&lt;{sig.typeParameter.map((param) => param.name).join(', ')}&gt;</span>
			)}

			<span className="tsd-signature-symbol">(</span>

			{sig.parameters?.map((param, index) => (
				<>
					{index > 0 && ', '}
					<span>
						{param.flags.isRest && <span className="tsd-signature-symbol">...</span>}
						{param.name}
						<span className="tsd-signature-symbol">
							{(param.flags.isOptional || 'defaultValue' in param) && '?'}
							{': '}
						</span>
						<Type type={param.type} />
					</span>
				</>
			))}

			<span className="tsd-signature-symbol">)</span>

			{sig.type && (
				<>
					<span className="tsd-signature-symbol"> =&gt; </span>
					<Type type={sig.type} />
				</>
			)}
		</>
	);
}
