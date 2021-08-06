// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/members.hbs

import React from 'react';
import { useDeclaration } from '../hooks/useDeclaration';
import { Flags } from './Flags';
import { MemberDeclaration } from './MemberDeclaration';
import { MemberGetterSetter } from './MemberGetterSetter';
import { MemberSignatures } from './MemberSignatures';

export interface MemberProps {
	id: number;
}

// TODO reference???
export function Member({ id }: MemberProps) {
	const reflection = useDeclaration(id);

	console.log('Member', id, reflection);

	let content: React.ReactNode = null;

	if (reflection.signatures) {
		content = <MemberSignatures sigs={reflection.signatures} />;
	} else if (reflection.getSignature || reflection.setSignature) {
		content = (
			<MemberGetterSetter getter={reflection.getSignature} setter={reflection.setSignature} />
		);
	} else {
		content = <MemberDeclaration id={id} />;
	}

	return (
		<section className="tsd-panel tsd-member {{cssClasses}}">
			<a id={`#${id}`} className="tsd-anchor"></a>

			<h3>
				<Flags flags={reflection.flags} /> {reflection.name}
			</h3>

			{content}

			{reflection.groups?.map((group) => (
				<React.Fragment key={group.title}>
					{group.children?.map((child) => (
						<Member key={child} id={child} />
					))}
				</React.Fragment>
			))}
		</section>
	);
}
