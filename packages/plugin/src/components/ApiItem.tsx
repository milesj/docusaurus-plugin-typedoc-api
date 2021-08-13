// This file is based on `DocItem` upstream, but since we aren't using markdown,
// we had to duplicate it. Keep this file in sync as much as possible!
// https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-theme-classic/src/theme/DocItem/index.tsx

import React, { useMemo } from 'react';
import type { JSONOutput } from 'typedoc';
import { TOCItem } from '@docusaurus/types';
import type { Props as DocItemProps } from '@theme/DocItem';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import { MainHeading } from '@theme/Heading';
import useWindowSize from '@theme/hooks/useWindowSize';
import Seo from '@theme/Seo';
import TOC from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import { useReflection } from '../hooks/useReflection';
import { useReflectionMap } from '../hooks/useReflectionMap';
import { ApiMetadata, DeclarationReflectionMap } from '../types';
import { getKindIconHtml } from '../utils/icons';
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
	const title = (item as JSONOutput.ProjectReflection).packageName ?? item.name ?? content.name;

	// Table of contents
	const toc = useMemo(() => extractTOC(item, reflections), [item, reflections]);
	const canRenderTOC = toc.length > 0;
	const renderTocMobile = canRenderTOC && (windowSize === 'mobile' || windowSize === 'ssr');
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
					<DocVersionBanner versionMetadata={versionMetadata} />

					<div className="apiItemContainer">
						<article>
							{showVersionBadge && (
								<span className="badge badge--secondary">Version: {versionMetadata.label}</span>
							)}

							{renderTocMobile && <TOCCollapsible className="apiTocMobile" toc={toc} />}

							<div className="markdown">
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
						</article>

						<DocPaginator metadata={pagingMetadata} />
					</div>
				</div>

				{renderTocDesktop && (
					<div className="col col--3">
						<TOC toc={toc} />
					</div>
				)}
			</div>
		</>
	);
}
