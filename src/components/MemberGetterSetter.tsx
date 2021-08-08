// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.getterSetter.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { MemberSignatureBody } from './MemberSignatureBody';
import { MemberSignatureTitle } from './MemberSignatureTitle';

export interface MemberGetterSetterProps {
	getter?: JSONOutput.DeclarationReflection['getSignature'];
	setter?: JSONOutput.DeclarationReflection['setSignature'];
}

export function MemberGetterSetter({
	getter: baseGetter,
	setter: baseSetter,
}: MemberGetterSetterProps) {
	const [getter] = baseGetter ?? [];
	const [setter] = baseSetter ?? [];

	return (
		<>
			<ul className="tsd-signatures {{cssClasses}}">
				{getter && (
					<li className="tsd-signature tsd-kind-icon">
						<span className="tsd-signature-symbol">get </span>
						{getter.name}
						<MemberSignatureTitle sig={getter} hideName />
					</li>
				)}

				{setter && (
					<li className="tsd-signature tsd-kind-icon">
						<span className="tsd-signature-symbol">set </span>
						{setter.name}
						<MemberSignatureTitle sig={setter} hideName />
					</li>
				)}
			</ul>

			<ul className="tsd-descriptions">
				{getter && (
					<li className="tsd-description">
						<MemberSignatureBody sig={getter} />
					</li>
				)}

				{setter && (
					<li className="tsd-description">
						<MemberSignatureBody sig={setter} />
					</li>
				)}
			</ul>
		</>
	);
}
