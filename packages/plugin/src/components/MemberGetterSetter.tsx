// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.getterSetter.hbs

import React from 'react';
import type { JSONOutput } from 'typedoc';
import { useMinimalLayout } from '../hooks/useMinimalLayout';
import { Icon } from './Icon';
import { hasSigBody, MemberSignatureBody } from './MemberSignatureBody';
import { MemberSignatureTitle } from './MemberSignatureTitle';

export interface MemberGetterSetterProps {
	inPanel?: boolean;
	getter?: JSONOutput.DeclarationReflection['getSignature'];
	setter?: JSONOutput.DeclarationReflection['setSignature'];
}

// eslint-disable-next-line complexity
export function MemberGetterSetter({ inPanel, getter, setter }: MemberGetterSetterProps) {
	const minimal = useMinimalLayout();

	if (!getter && !setter) {
		return null;
	}

	return (
		<>
			{(getter || setter) && (
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
			)}

			{(hasSigBody(getter, minimal) || hasSigBody(setter, minimal)) && (
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
			)}
		</>
	);
}
