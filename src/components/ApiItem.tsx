// This file is based on `DocItem` upstream, but since we aren't using markdown,
// we had to duplicate it. Keep this file in sync as much as possible!
// https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-theme-classic/src/theme/DocItem/index.tsx

import React, { useMemo } from 'react';
import styles from '@docusaurus/theme-classic/lib/theme/DocItem/styles.module.css';
import { TOCItem } from '@docusaurus/types';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import { MainHeading } from '@theme/Heading';
import useWindowSize from '@theme/hooks/useWindowSize';
import Seo from '@theme/Seo';
import TOC from '@theme/TOC';
// import TOCCollapsible from '@theme/TOCCollapsible';
import { useDeclaration } from '../hooks/useDeclaration';
import { ApiMetadata, DeclarationInfo } from '../types';
import { getKindIconHtml } from '../utils/icons';

function extractTOC(item: DeclarationInfo): TOCItem[] {
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
}

export default function ApiItem({ content }: ApiItemProps) {
	const item = useDeclaration(content.id)!;
	const prevItem = useDeclaration(content.previousId);
	const nextItem = useDeclaration(content.nextId);
	const windowSize = useWindowSize();

	// Table of contents
	const toc = useMemo(() => extractTOC(item), [item]);
	const canRenderTOC = toc.length > 0;
	// const renderTocMobile = canRenderTOC && (windowSize === 'mobile' || windowSize === 'ssr');
	const renderTocDesktop = canRenderTOC && (windowSize === 'desktop' || windowSize === 'ssr');

	// Enable once we support versioning
	const versionMetadata = { banner: 'none', label: '' };
	const showVersionBadge = false;

	console.log('ApiItem', content, item);

	return (
		<>
			<Seo title={content.name} description={item.comment?.shortText ?? item.comment?.text} />

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
								<MainHeading>{content.name}</MainHeading>
								CONTENT
							</div>
						</article>

						<DocPaginator
							metadata={{
								next: nextItem && {
									permalink: nextItem.permalink,
									title: nextItem.name,
								},
								previous: prevItem && {
									permalink: prevItem.permalink,
									title: prevItem.name,
								},
							}}
						/>
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
