// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.sources.hbs

import React from 'react';
import type { JSONOutput } from 'typedoc';
import { TypeAndParent } from './TypeAndParent';

export function hasSources(reflection: Omit<JSONOutput.DeclarationReflection, 'variant'>) {
	return Boolean(reflection.implementationOf || reflection.inheritedFrom || reflection.overwrites);
}

export interface MemberSourcesProps {
	reflection: Omit<JSONOutput.DeclarationReflection, 'variant'>;
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
