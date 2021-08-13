// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.sources.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { TypeAndParent } from './TypeAndParent';

export interface MemberSourcesProps {
	reflection: JSONOutput.DeclarationReflection;
}

export function MemberSources({ reflection }: MemberSourcesProps) {
	if (!reflection.implementationOf && !reflection.inheritedFrom && !reflection.overwrites) {
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
