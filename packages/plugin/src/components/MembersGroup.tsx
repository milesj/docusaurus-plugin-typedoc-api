// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/members.group.hbs

import React from 'react';
import type { JSONOutput } from 'typedoc';
import { useReflectionMap } from '../hooks/useReflectionMap';
import { hasOwnDocument } from '../utils/visibility';
import { AnchorLink } from './AnchorLink';
import { Member } from './Member';

export interface MembersGroupProps {
	group: JSONOutput.ReflectionGroup;
}

export function MembersGroup({ group }: MembersGroupProps) {
	const reflections = useReflectionMap();

	if (group.categories && group.categories.length > 0) {
		return (
			<>
				{group.categories.map((category) => (
					<section key={category.title} className="tsd-panel-group tsd-member-group">
						<h2>
							{category.title === 'CATEGORY' ? 'Other' : category.title}{' '}
							<AnchorLink id={category.title} />
						</h2>

						{category.children?.map((child) =>
							hasOwnDocument(child, reflections) ? null : <Member key={child} id={child} />,
						)}
					</section>
				))}
			</>
		);
	}

	return (
		<section className="tsd-panel-group tsd-member-group">
			<h2>
				{group.title} <AnchorLink id={group.title} />
			</h2>

			{group.children?.map((child) =>
				hasOwnDocument(child, reflections) ? null : <Member key={child} id={child} />,
			)}
		</section>
	);
}
