// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/members.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { useReflection } from '../hooks/useReflection';
import { useReflectionMap } from '../hooks/useReflectionMap';
import { hasOwnDocument } from '../utils/visibility';
import { AnchorLink } from './AnchorLink';
import { Flags } from './Flags';
import { MemberDeclaration } from './MemberDeclaration';
import { MemberGetterSetter } from './MemberGetterSetter';
import { MemberReference } from './MemberReference';
import { MemberSignatures } from './MemberSignatures';
import { SourceLink } from './SourceLink';

export interface MemberProps {
	id: number;
}

export function Member({ id }: MemberProps) {
	const reflections = useReflectionMap();
	const reflection = useReflection(id)!;

	let content: React.ReactNode = null;

	if (reflection.signatures) {
		content = <MemberSignatures inPanel sigs={reflection.signatures} />;
	} else if (reflection.getSignature || reflection.setSignature) {
		content = (
			<MemberGetterSetter
				inPanel
				getter={reflection.getSignature}
				setter={reflection.setSignature}
			/>
		);
	} else if ('target' in reflection && (reflection as JSONOutput.ReferenceReflection).target) {
		content = <MemberReference reflection={reflection as JSONOutput.ReferenceReflection} />;
	} else {
		content = <MemberDeclaration id={id} />;
	}

	return (
		<section className="tsd-panel tsd-member">
			<h3 className="tsd-panel-header">
				<AnchorLink id={reflection.name} />
				<SourceLink sources={reflection.sources} />
				<Flags flags={reflection.flags} />
				{reflection.name}
			</h3>

			{content}

			{reflection.groups?.map((group) => (
				<React.Fragment key={group.title}>
					{group.children?.map((child) =>
						hasOwnDocument(child, reflections) ? null : <Member key={child} id={child} />,
					)}
				</React.Fragment>
			))}
		</section>
	);
}
