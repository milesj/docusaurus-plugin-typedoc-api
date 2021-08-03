// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.getterSetter.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { MemberSignatureBody } from './MemberSignatureBody';
import { MemberSignatureTitle } from './MemberSignatureTitle';

export interface MemberGetterSetterProps {
	reflection: JSONOutput.DeclarationReflection;
}

export function MemberGetterSetter({ reflection }: MemberGetterSetterProps) {
	// TODO cssClasses
	return (
		<>
			<ul className="tsd-signatures {{cssClasses}}">
				{reflection.getSignature && (
					<li className="tsd-signature tsd-kind-icon">
						<span className="tsd-signature-symbol">get </span>
						{reflection.name}
						<MemberSignatureTitle sig={reflection.getSignature[0]} hideName />
					</li>
				)}

				{reflection.setSignature && (
					<li className="tsd-signature tsd-kind-icon">
						<span className="tsd-signature-symbol">set </span>
						{reflection.name}
						<MemberSignatureTitle sig={reflection.setSignature[0]} hideName />
					</li>
				)}
			</ul>

			<ul className="tsd-descriptions">
				{reflection.getSignature && (
					<li className="tsd-description">
						<MemberSignatureBody sig={reflection.getSignature[0]} />
					</li>
				)}

				{reflection.setSignature && (
					<li className="tsd-description">
						<MemberSignatureBody sig={reflection.setSignature[0]} />
					</li>
				)}
			</ul>
		</>
	);
}
