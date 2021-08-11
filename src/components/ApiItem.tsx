// This file is based on `DocItem` upstream, but since we aren't using markdown,
// we had to duplicate it. Keep this file in sync as much as possible!
// https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-theme-classic/src/theme/DocItem/index.tsx

import React, { useMemo } from 'react';
import type { JSONOutput } from 'typedoc';
import type { PropVersionMetadata } from '@docusaurus/plugin-content-docs-types';
import styles from '@docusaurus/theme-classic/lib/theme/DocItem/styles.module.css';
import { TOCItem } from '@docusaurus/types';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import { MainHeading } from '@theme/Heading';
import useWindowSize from '@theme/hooks/useWindowSize';
import Seo from '@theme/Seo';
import TOC from '@theme/TOC';
// import TOCCollapsible from '@theme/TOCCollapsible';
import { useReflection } from '../hooks/useReflection';
import { ApiMetadata } from '../types';
import { getKindIconHtml } from '../utils/icons';
import { Reflection } from './Reflection';
import { TypeParametersGeneric } from './TypeParametersGeneric';

function extractTOC(item: JSONOutput.DeclarationReflection): TOCItem[] {
	const toc: TOCItem[] = [];

	item.children?.forEach((child) => {
		const iconHtml = getKindIconHtml(child.kind, child.name);

		toc.push({
			children: [],
			id: child.name,
			value: iconHtml ? `${iconHtml} ${child.name}` : child.name,
		});
	});

	return toc;
}

export interface ApiItemProps {
	content: ApiMetadata;
	readme?: React.ComponentType;
}

export default function ApiItem({ content, readme: Readme }: ApiItemProps) {
	const item = useReflection(content.id)!;
	const prevItem = useReflection(content.previousId);
	const nextItem = useReflection(content.nextId);
	const windowSize = useWindowSize();

	// Table of contents
	const toc = useMemo(() => extractTOC(item), [item]);
	const canRenderTOC = toc.length > 0;
	// const renderTocMobile = canRenderTOC && (windowSize === 'mobile' || windowSize === 'ssr');
	// const renderTocDesktop = canRenderTOC && (windowSize === 'desktop' || windowSize === 'ssr');
	const renderTocDesktop = canRenderTOC && windowSize === 'desktop';

	// Enable once we support versioning
	const showVersionBadge = false;
	const versionMetadata: PropVersionMetadata = useMemo(
		() => ({
			banner: 'none',
			label: '',
			pluginId: 'default',
			version: 'current',
			isLast: true,
			docsSidebars: {},
			permalinkToSidebar: {},
		}),
		[],
	);

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
			<Seo description={item.comment?.shortText ?? item.comment?.text} title={content.name} />

			<div className="row">
				<div className={`col ${styles.docItemCol}`}>
					<DocVersionBanner versionMetadata={versionMetadata} />

					<div className={styles.docItemContainer}>
						<article>
							{showVersionBadge && (
								<span className="badge badge--secondary">Version: {versionMetadata.label}</span>
							)}

							{/* renderTocMobile && <TOCCollapsible toc={toc} className={styles.tocMobile} /> */}

							<div className="markdown">
								<MainHeading>
									{(item as JSONOutput.ProjectReflection).packageName ?? item.name ?? content.name}
									<TypeParametersGeneric params={item.typeParameter} />
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
