// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/hierarchy.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { HierarchyNode } from '../utils/hierarchy';
import { Type } from './Type';

export interface HierarchyProps {
	tree: HierarchyNode;
}

export function Hierarchy({ tree }: HierarchyProps) {
	return (
		<ul className="tsd-hierarchy">
			{tree.types.map((type, i) => (
				<li>
					{tree.isTarget ? (
						<em className="tsd-target">
							{type.type === 'reference' ? (type as JSONOutput.ReferenceType).name : 'UNKNOWN'}
						</em>
					) : (
						<Type type={type} />
					)}

					{i === tree.types.length - 1 && tree.next && <Hierarchy tree={tree.next} />}
				</li>
			))}
		</ul>
	);
}
