// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/breadcrumb.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { useReflection } from '../hooks/useReflection';

export interface BreadcrumbProps {
	reflection: JSONOutput.Reflection;
}

export function Breadcrumb({ reflection }: BreadcrumbProps) {
	const parent = useReflection(reflection.parentId);

	if (parent) {
		return (
			<>
				<Breadcrumb reflection={parent} />
				<li>
					{reflection.permalink ? (
						<a href={reflection.permalink}>{reflection.name}</a>
					) : (
						<span>{reflection.name}</span>
					)}
				</li>
			</>
		);
	}

	if (reflection.permalink) {
		return (
			<li>
				<a href={reflection.permalink}>{reflection.name}</a>
			</li>
		);
	}

	return null;
}
