import { useMemo } from 'react';
import type { InlineTagDisplayPart } from 'typedoc'
import { PageMetadata } from '@docusaurus/theme-common';
import type { Props as DocItemProps } from '@theme/DocItem';
import { useReflection, useRequiredReflection } from '../hooks/useReflection';
import { useReflectionMap } from '../hooks/useReflectionMap';
import type { TOCItem, TSDDeclarationReflection, TSDDeclarationReflectionMap } from '../types';
import { escapeMdx } from '../utils/helpers';
import { getKindIconHtml } from '../utils/icons';
import ApiItemLayout from './ApiItemLayout';
import { displayPartsToMarkdown } from './Comment';
import { Flags } from './Flags';
import { Reflection } from './Reflection';
import { TypeParametersGeneric } from './TypeParametersGeneric';

function extractTOC(item: TSDDeclarationReflection, map: TSDDeclarationReflectionMap): TOCItem[] {
	const toc: TOCItem[] = [];
	const mapped = new Set<string>();

	item.groups?.forEach((group) => {
		group.children?.forEach((childId) => {
			const child = map[childId];

			if (mapped.has(child.name)) {
				return;
			}

			if (!child.permalink || child.permalink.includes('#')) {
				const iconHtml = getKindIconHtml(child.kind, child.name);
				const value = escapeMdx(child.name);

				toc.push({
					// @ts-expect-error Not typed upstream
					children: [],
					id: child.name,
					value: iconHtml ? `${iconHtml} ${value}` : value,
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

// eslint-disable-next-line complexity
export default function ApiItem({ readme: Readme, route }: ApiItemProps) {
	const item = useRequiredReflection((route as unknown as { id: number }).id);
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
						title: escapeMdx(nextItem.name),
					}
				: undefined,
			previous: prevItem
				? {
						permalink: prevItem.permalink,
						title: escapeMdx(prevItem.name),
					}
				: undefined,
		}),
		[nextItem, prevItem],
	);

	// Add @reference categories.
	const referenceCategories: Record<string, { title: string; children: number[] }> = {};
	for (const tag of item.comment?.blockTags ?? []) {
		if (tag.tag === '@reference' && tag.content.length >= 2 && tag.content[0].kind === 'text') {
			const categoryName = tag.content[0].text.trim();
			const ref = (tag.content as InlineTagDisplayPart[]).find((t) => t.tag === '@link');

			if (ref && typeof ref.target === 'number') {
				if (!(categoryName in referenceCategories)) {
					referenceCategories[categoryName] = { title: categoryName, children: [] };
				}

				if (!referenceCategories[categoryName].children.includes(ref.target)) {
					referenceCategories[categoryName].children.push(ref.target);
				}
			}
		}
	}

	if (!item.categories) {
		item.categories = [];
	}
	for (const category of Object.values(referenceCategories)) {
		if (category.children.length > 0) {
			const index = item.categories.findIndex((c) => c.title === category.title);
			if (index === -1) {
				item.categories.push(category);
			}
		}
	}

	return (
		<ApiItemLayout
			heading={
				<>
					<span className="tsd-header-flags">
						<Flags flags={item.flags} />
					</span>
					{escapeMdx(item.name)} <TypeParametersGeneric params={item.typeParameters} />
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
