// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.getterSetter.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { Icon } from './Icon';
import { MemberSignatureBody } from './MemberSignatureBody';
import { MemberSignatureTitle } from './MemberSignatureTitle';

export interface MemberGetterSetterProps {
	inPanel?: boolean;
	getter?: JSONOutput.DeclarationReflection['getSignature'];
	setter?: JSONOutput.DeclarationReflection['setSignature'];
}

export function MemberGetterSetter({
	inPanel,
	getter: baseGetter,
	setter: baseSetter,
}: MemberGetterSetterProps) {
	const [getter] = baseGetter ?? [];
	const [setter] = baseSetter ?? [];

	if (!getter && !setter) {
		return null;
	}

	return (
		<>
			<div className={inPanel ? 'tsd-panel-content' : ''}>
				<ul className="tsd-signatures">
					{getter && (
						<li className="tsd-signature tsd-kind-icon">
							<Icon reflection={getter} />
							<span className="tsd-signature-symbol">get </span>
							{getter.name}
							<MemberSignatureTitle hideName sig={getter} />
						</li>
					)}

					{setter && (
						<li className="tsd-signature tsd-kind-icon">
							<Icon reflection={setter} />
							<span className="tsd-signature-symbol">set </span>
							{setter.name}
							<MemberSignatureTitle hideName sig={setter} />
						</li>
					)}
				</ul>
			</div>

			<div className={inPanel ? 'tsd-panel-content' : ''}>
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
			</div>
		</>
	);
}