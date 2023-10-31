// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/members.hbs

import { useReflectionMap } from '../hooks/useReflectionMap';
import type { TSDDeclarationReflection } from '../types';
import {
	allCategoryChildrenHaveOwnDocument,
	allGroupChildrenHaveOwnDocument,
	hasOwnDocument,
} from '../utils/visibility';
import { AnchorLink } from './AnchorLink';
import { Member } from './Member';
import { MembersGroup } from './MembersGroup';

export interface MembersProps {
	reflection: TSDDeclarationReflection;
}

export function Members({ reflection }: MembersProps) {
	const reflections = useReflectionMap();

	if (reflection.categories && reflection.categories.length > 0) {
		return (
			<>
				{reflection.categories.map((category) => {
					if (allCategoryChildrenHaveOwnDocument(category, reflections)) {
						return null;
					}

					return (
						<section key={category.title} className="tsd-panel-group tsd-member-group">
							<h2>
								{category.title === '__CATEGORY__' ? 'Other' : category.title}{' '}
								<AnchorLink id={category.title} />
							</h2>

							{category.children?.map((child) => {
								if (hasOwnDocument(child, reflections)) {
									return null;
								}

								return <Member key={child} id={child} />;
							})}
						</section>
					);
				})}
			</>
		);
	}

	return (
		<>
			{reflection.groups?.map((group) => {
				if (allGroupChildrenHaveOwnDocument(group, reflections)) {
					return null;
				}

				return <MembersGroup key={group.title} group={group} />;
			})}
		</>
	);
}
