// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.reference.hbs

import React from 'react';
import type { JSONOutput } from 'typedoc';
import Link from '@docusaurus/Link';
import { useReflection } from '../hooks/useReflection';

export interface MemberReferenceProps {
	reflection: JSONOutput.ReferenceReflection;
}

export function MemberReference({ reflection }: MemberReferenceProps) {
	const target = useReflection(reflection.target);
	let content: React.ReactNode = null;

	if (!target) {
		content = (
			<>
				Re-exports <span className="tsd-signature-type">{reflection.name}</span>
			</>
		);
	} else if (reflection.name === target.name) {
		content = (
			<>
				Re-exports{' '}
				<Link className="tsd-signature-type" to={target.permalink}>
					{target.name}
				</Link>
			</>
		);
	} else {
		content = (
			<>
				Renames and re-exports{' '}
				<Link className="tsd-signature-type" to={target.permalink}>
					{target.name}
				</Link>
			</>
		);
	}

	return <div className="tsd-panel-content">{content}</div>;
}
