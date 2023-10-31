// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.sources.hbs

import type { TSDDeclarationReflection, TSDSignatureReflection } from '../types';
import { TypeAndParent } from './TypeAndParent';

export function hasSources(reflection: TSDDeclarationReflection | TSDSignatureReflection) {
	return Boolean(reflection.implementationOf || reflection.inheritedFrom || reflection.overwrites);
}

export interface MemberSourcesProps {
	reflection: TSDDeclarationReflection | TSDSignatureReflection;
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
