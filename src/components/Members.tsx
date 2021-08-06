// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/members.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { Member } from './Member';

export interface MembersProps {
	reflection: JSONOutput.DeclarationReflection;
}

// `categories` does not exist in the JSON, so ignoring it
export function Members({ reflection }: MembersProps) {
	console.log('Members', reflection);

	return (
		<>
			{reflection.groups?.map((group) => (
				<section key={group.title} className="tsd-panel-group tsd-member-group {{cssClasses}}">
					<h2>{group.title}</h2>

					{group.children?.map((child) => (
						<Member key={child} id={child} />
					))}
				</section>
			))}
		</>
	);
}
