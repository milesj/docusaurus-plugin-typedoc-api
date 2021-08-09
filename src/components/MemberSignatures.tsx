// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.signatures.hbs

import React, { useState } from 'react';
import { JSONOutput } from 'typedoc';
import { Icon } from './Icon';
import { MemberSignatureBody } from './MemberSignatureBody';
import { MemberSignatureTitle } from './MemberSignatureTitle';

export interface MemberSignaturesProps {
	inPanel?: boolean;
	sigs: JSONOutput.SignatureReflection[];
}

export function MemberSignatures({ inPanel, sigs }: MemberSignaturesProps) {
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<>
			<div className={inPanel ? 'tsd-panel-content' : ''}>
				<ul className="tsd-signatures {{cssClasses}}">
					{sigs.map((sig, i) => (
						<li
							key={sig.id}
							className={`tsd-signature tsd-pressable tsd-kind-icon ${
								i !== activeIndex && 'tsd-signature-inactive'
							}`}
							onClick={() => {
								setActiveIndex(i);
							}}
						>
							<Icon reflection={sig} />
							<MemberSignatureTitle sig={sig} />
						</li>
					))}
				</ul>
			</div>

			<div className={inPanel ? 'tsd-panel-content' : ''}>
				<ul className="tsd-descriptions">
					<li key={sigs[activeIndex].id} className="tsd-description">
						<MemberSignatureBody sig={sigs[activeIndex]} />
					</li>
				</ul>
			</div>
		</>
	);
}
