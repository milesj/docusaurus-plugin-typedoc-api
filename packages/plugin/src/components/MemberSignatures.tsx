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
	const body = sigs[activeIndex];

	return (
		<>
			<div className={inPanel ? 'tsd-panel-content' : ''}>
				<ul className="tsd-signatures">
					{sigs.map((sig, i) => (
						<li
							key={sig.id}
							className={`tsd-signature tsd-pressable tsd-kind-icon ${
								i !== activeIndex && 'tsd-signature-inactive'
							}`}
						>
							<div
								role="button"
								tabIndex={-1}
								// eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
								onKeyDown={() => {
									setActiveIndex(i);
								}}
							>
								<Icon reflection={sig} />
								<MemberSignatureTitle sig={sig} />
							</div>
						</li>
					))}
				</ul>
			</div>

			{!!body && (
				<div className={inPanel ? 'tsd-panel-content' : ''}>
					<ul className="tsd-descriptions">
						<li key={body.id} className="tsd-description">
							<MemberSignatureBody sig={body} />
						</li>
					</ul>
				</div>
			)}
		</>
	);
}
