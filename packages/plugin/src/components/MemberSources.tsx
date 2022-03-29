// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.sources.hbs

import React from 'react';
import type { JSONOutput } from 'typedoc';
import { TypeAndParent } from './TypeAndParent';

export function hasSources(reflection: JSONOutput.DeclarationReflection) {
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	return Boolean(reflection.implementationOf || reflection.inheritedFrom || reflection.overwrites);
}

export interface MemberSourcesProps {
	reflection: JSONOutput.DeclarationReflection;
}

export function MemberSources({ reflection }: MemberSourcesProps) {
	if (!hasSources(reflection)) {
		return null;
	}

	return (
		<aside className="tsd-sources">
			{reflection.implementationOf && (
				<p>
					Implementation of <TypeAndParent type={reflection.implementationOf} />
				</p>
			)}

			{reflection.inheritedFrom && (
				<p>
					Inherited from <TypeAndParent type={reflection.inheritedFrom} />
				</p>
			)}

			{reflection.overwrites && (
				<p>
					Overrides <TypeAndParent type={reflection.overwrites} />
				</p>
			)}
		</aside>
	);
}
