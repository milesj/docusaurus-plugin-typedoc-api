// This file is based on `DocItem` upstream, but since we aren't using markdown,
// we had to duplicate it. Keep this file in sync as much as possible!
// https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-theme-classic/src/theme/DocItem/index.tsx

import React from 'react';
import type { PropNavigation } from '@docusaurus/plugin-content-docs';
import { ThemeClassNames, useWindowSize } from '@docusaurus/theme-common';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import type { Props as DocItemProps } from '@theme/DocItem';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBadge from '@theme/DocVersionBadge';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import TOC from '@theme/TOC';
import TOCCollapsible from '@theme/TOCCollapsible';
import { useBreadcrumbs } from '../hooks/useBreadcrumbs';
import type { TOCItem } from '../types';
import { Footer } from './Footer';
import { VersionBanner } from './VersionBanner';

export interface ApiItemLayoutProps extends Pick<DocItemProps, 'route'> {
	children: React.ReactNode;
	heading: React.ReactNode;
	toc: readonly TOCItem[];
	pageMetadata?: React.ReactNode;
	pagingMetadata?: PropNavigation;
}

export default function ApiItemLayout({
	children,
	heading,
	pageMetadata,
	pagingMetadata,
	toc,
}: ApiItemLayoutProps) {
	const windowSize = useWindowSize();
	const breadcrumbs = useBreadcrumbs();

	// Table of contents
	const canRenderTOC = toc.length > 0;
	const renderTocDesktop = canRenderTOC && (windowSize === 'desktop' || windowSize === 'ssr');

	return (
		<>
			{pageMetadata}

			<div className="row">
				<div className="col apiItemCol">
					<VersionBanner />

					<div className="apiItemContainer">
						<article>
							{breadcrumbs && <DocBreadcrumbs />}

							<DocVersionBadge />

							{canRenderTOC && (
								<TOCCollapsible
									className={`${ThemeClassNames.docs.docTocMobile ?? ''} apiTocMobile`}
									maxHeadingLevel={6}
									minHeadingLevel={1}
									toc={toc}
								/>
							)}

							<div className={`${ThemeClassNames.docs.docMarkdown ?? ''} markdown`}>
								<header>
									<Heading as="h1">{heading}</Heading>
								</header>

								<MDXContent>{children}</MDXContent>
							</div>

							<Footer />
						</article>

						{pagingMetadata && <DocPaginator {...pagingMetadata} />}
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
