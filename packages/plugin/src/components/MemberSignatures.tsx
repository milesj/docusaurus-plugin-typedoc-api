/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.signatures.hbs

import React, { useState } from 'react';
import type { JSONOutput } from 'typedoc';
import { useMinimalLayout } from '../hooks/useMinimalLayout';
import { Icon } from './Icon';
import { hasSigBody, MemberSignatureBody } from './MemberSignatureBody';
import { MemberSignatureTitle } from './MemberSignatureTitle';

export interface MemberSignaturesProps {
	inPanel?: boolean;
	sigs: JSONOutput.SignatureReflection[];
}

export function MemberSignatures({ inPanel, sigs }: MemberSignaturesProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const minimal = useMinimalLayout();
	const hasMultiple = sigs.length > 1;
	const body = sigs[activeIndex];

	return (
		<>
			<div className={inPanel ? 'tsd-panel-content' : ''}>
				<ul className="tsd-signatures">
					{sigs.map((sig, i) => (
						<li
							key={sig.id}
							className={`tsd-signature tsd-kind-icon ${
								i === activeIndex ? '' : 'tsd-signature-inactive'
							} ${hasMultiple ? 'tsd-pressable' : ''}`}
							onClick={
								hasMultiple
									? // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
									  () => {
											setActiveIndex(i);
									  }
									: undefined
							}
						>
							<Icon reflection={sig} />
							<MemberSignatureTitle sig={sig} />
						</li>
					))}
				</ul>
			</div>

			{hasSigBody(body, minimal) && (
				<>
					{!inPanel && <hr className="tsd-divider" />}

					<div className={inPanel ? 'tsd-panel-content' : ''}>
						<ul className="tsd-descriptions">
							<li key={body.id} className="tsd-description">
								<MemberSignatureBody sig={body} />
							</li>
						</ul>
					</div>
				</>
			)}
		</>
	);
}
