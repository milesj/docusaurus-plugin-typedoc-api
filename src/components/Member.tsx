// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/members.hbs

import React from 'react';
import { useReflection } from '../hooks/useReflection';
import { useReflectionMap } from '../hooks/useReflectionMap';
import { hasOwnDocument } from '../utils/visibility';
import { Anchor } from './Anchor';
import { Flags } from './Flags';
import { MemberDeclaration } from './MemberDeclaration';
import { MemberGetterSetter } from './MemberGetterSetter';
// import { MemberReference } from './MemberReference';
import { MemberSignatures } from './MemberSignatures';

export interface MemberProps {
	id: number;
}

// TODO reference???
export function Member({ id }: MemberProps) {
	const reflections = useReflectionMap();
	const reflection = useReflection(id);

	let content: React.ReactNode = null;

	if (reflection.signatures) {
		content = <MemberSignatures sigs={reflection.signatures} inPanel />;
	} else if (reflection.getSignature || reflection.setSignature) {
		content = (
			<MemberGetterSetter
				getter={reflection.getSignature}
				setter={reflection.setSignature}
				inPanel
			/>
		);
	} else if (String(reflection.type) === 'reference') {
		console.debug('WHAT TO DO HERE?');
		content = null; // <MemberReference ref={reflection} />;
	} else {
		content = <MemberDeclaration id={id} />;
	}

	return (
		<section className="tsd-panel tsd-member">
			<h3 className="tsd-panel-header">
				<Anchor id={reflection.name} />
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
