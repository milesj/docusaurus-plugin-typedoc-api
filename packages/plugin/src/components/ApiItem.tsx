// This file is based on `DocItem` upstream, but since we aren't using markdown,
// we had to duplicate it. Keep this file in sync as much as possible!
// https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/DocItem/index.tsx

import React, { useMemo } from 'react';
import type { JSONOutput } from 'typedoc';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { TOCItem } from '@docusaurus/types';
import type { Props as DocItemProps } from '@theme/DocItem';
import DocPaginator from '@theme/DocPaginator';
import { MainHeading } from '@theme/Heading';
import useWindowSize from '@theme/hooks/useWindowSize';
import Seo from '@theme/Seo';
import TOC from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import { useReflection } from '../hooks/useReflection';
import { useReflectionMap } from '../hooks/useReflectionMap';
import { ApiMetadata, DeclarationReflectionMap } from '../types';
import { getKindIconHtml } from '../utils/icons';
import { Footer } from './Footer';
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

export interface ApiItemProps extends Omit<DocItemProps, 'content'> {
	content: ApiMetadata;
	readme?: React.ComponentType;
}

// eslint-disable-next-line complexity
export default function ApiItem({ content, readme: Readme, versionMetadata }: ApiItemProps) {
	const item = useReflection(content.id)!;
	const prevItem = useReflection(content.previousId);
	const nextItem = useReflection(content.nextId);
	const reflections = useReflectionMap();
	const windowSize = useWindowSize();
	const title = item.name ?? content.name;

	// Table of contents
	const toc = useMemo(() => extractTOC(item, reflections), [item, reflections]);
	const canRenderTOC = toc.length > 0;
	const renderTocDesktop = canRenderTOC && (windowSize === 'desktop' || windowSize === 'ssr');

	// Enable once we support versioning
	const showVersionBadge = false;
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
		<>
			<Seo description={item.comment?.shortText ?? item.comment?.text} title={`${title} | API`} />

			<div className="row">
				<div className="col apiItemCol">
					<div className="apiItemContainer">
						<article>
							{showVersionBadge && (
								<span
									className={`${ThemeClassNames.docs.docVersionBadge ?? ''} badge badge--secondary`}
								>
									Version: {versionMetadata.label}
								</span>
							)}

							{canRenderTOC && (
								<TOCCollapsible
									className={`${ThemeClassNames.docs.docTocMobile ?? ''} apiTocMobile`}
									maxHeadingLevel={6}
									minHeadingLevel={1}
									toc={toc}
								/>
							)}

							<div className={`${ThemeClassNames.docs.docMarkdown ?? ''} markdown`}>
								<MainHeading>
									{title} <TypeParametersGeneric params={item.typeParameter} />
								</MainHeading>

								{Readme && (
									<section className="tsd-readme">
										<Readme />
									</section>
								)}

								<Reflection reflection={item} />
							</div>

							<Footer />
						</article>

						<DocPaginator metadata={pagingMetadata} />
					</div>
				</div>

				{renderTocDesktop && (
					<div className="col col--3">
						<TOC
							className={ThemeClassNames.docs.docTocDesktop}
							maxHeadingLevel={6}
							minHeadingLevel={1}
							toc={toc}
						/>
					</div>
				)}
			</div>
		</>
	);
}
