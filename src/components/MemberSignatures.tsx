// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.signatures.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { MemberSignatureBody } from './MemberSignatureBody';
import { MemberSignatureTitle } from './MemberSignatureTitle';

export interface MemberSignaturesProps {
	sigs: JSONOutput.SignatureReflection[];
}

export function MemberSignatures({ sigs }: MemberSignaturesProps) {
	console.log('MemberSignatures', sigs);

	// TODO cssClasses
	return (
		<>
			<ul className="tsd-signatures {{cssClasses}}">
				{sigs.map((sig) => (
					<li className="tsd-signature tsd-kind-icon">
						<MemberSignatureTitle sig={sig} />
					</li>
				))}
			</ul>

			<ul className="tsd-descriptions">
				{sigs.map((sig) => (
					<li className="tsd-description">
						<MemberSignatureBody sig={sig} />
					</li>
				))}
			</ul>
		</>
	);
}
