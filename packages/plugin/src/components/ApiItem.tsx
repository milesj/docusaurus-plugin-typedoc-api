import React, { useMemo } from 'react';
import type { JSONOutput } from 'typedoc';
import { PageMetadata } from '@docusaurus/theme-common';
import type { Props as DocItemProps } from '@theme/DocItem';
import { useReflection } from '../hooks/useReflection';
import { useReflectionMap } from '../hooks/useReflectionMap';
import type { DeclarationReflectionMap, TOCItem } from '../types';
import { getKindIconHtml } from '../utils/icons';
import ApiItemLayout from './ApiItemLayout';
import { displayPartsToMarkdown } from './Comment';
import { Flags } from './Flags';
import { Reflection } from './Reflection';
import { TypeParametersGeneric } from './TypeParametersGeneric';

function extractTOC(
	item: JSONOutput.DeclarationReflection,
	map: DeclarationReflectionMap,
): TOCItem[] {
	const toc: TOCItem[] = [];
	const mapped = new Set<string>();

	item.groups?.forEach((group) => {
		group.children?.forEach((childId) => {
			const child = map[childId]!;

			if (mapped.has(child.name)) {
				return;
			}

			const iconHtml = getKindIconHtml(child.kind, child.name);

			if (!child.permalink || child.permalink.includes('#')) {
				toc.push({
					// @ts-expect-error Not typed upstream
					children: [],
					id: child.name,
					value: iconHtml ? `${iconHtml} ${child.name}` : child.name,
					level: 1,
				});

				mapped.add(child.name);
			}
		});
	});

	return toc;
}

export interface ApiItemProps extends Pick<DocItemProps, 'route'> {
	readme?: React.ComponentType;
}

export default function ApiItem({ readme: Readme, route }: ApiItemProps) {
	const item = useReflection((route as unknown as { id: number }).id)!;
	const reflections = useReflectionMap();
	const toc = useMemo(() => extractTOC(item, reflections), [item, reflections]);

	// Pagination
	const prevItem = useReflection(item.previousId);
	const nextItem = useReflection(item.nextId);
	const pagingMetadata = useMemo(
		() => ({
			next: nextItem
				? {
						permalink: nextItem.permalink,
						title: nextItem.name,
				  }
				: undefined,
			previous: prevItem
				? {
						permalink: prevItem.permalink,
						title: prevItem.name,
				  }
				: undefined,
		}),
		[nextItem, prevItem],
	);

	return (
		<ApiItemLayout
			heading={
				<>
					<span className="tsd-header-flags">
						<Flags flags={item.flags} />
					</span>
					{item.name} <TypeParametersGeneric params={item.typeParameters} />
				</>
			}
			pageMetadata={
				<PageMetadata
					description={item.comment?.summary ? displayPartsToMarkdown(item.comment.summary) : ''}
					title={`${item.name} | API`}
				/>
			}
			pagingMetadata={pagingMetadata}
			route={route}
			toc={toc}
		>
			{Readme && (
				<section className="tsd-readme">
					<Readme />
				</section>
			)}

			<Reflection reflection={item} />
		</ApiItemLayout>
	);
}
