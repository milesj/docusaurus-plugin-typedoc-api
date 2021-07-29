// This is a modified version of DocPage from the classic theme. Keep in sync!
// @link https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-theme-classic/src/theme/DocPage/index.tsx

import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import styles from '@docusaurus/theme-classic/src/theme/DocPage/styles.module.css';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import DocSidebar from '@theme/DocSidebar';
import IconArrow from '@theme/IconArrow';
import Layout from '@theme/Layout';
import { SidebarItem } from '../types';

interface ApiPageContentProps {
	location: { pathname: string };
	children: React.ReactNode;
	sidebar: SidebarItem[];
}

function ApiPageContent({ location, children, sidebar }: ApiPageContentProps): JSX.Element {
	const { isClient } = useDocusaurusContext();
	const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false);
	const [hiddenSidebar, setHiddenSidebar] = useState(false);
	const toggleSidebar = useCallback(() => {
		if (hiddenSidebar) {
			setHiddenSidebar(false);
		}

		setHiddenSidebarContainer(!hiddenSidebarContainer);
	}, [hiddenSidebar]);

	return (
		<Layout
			key={String(isClient)}
			wrapperClassName={ThemeClassNames.wrapper.docPages}
			pageClassName={ThemeClassNames.page.docPage}
		>
			<div className={styles.docPage}>
				<aside
					className={clsx(styles.docSidebarContainer, {
						[styles.docSidebarContainerHidden]: hiddenSidebarContainer,
					})}
					onTransitionEnd={(e) => {
						if (!e.currentTarget.classList.contains(styles.docSidebarContainer)) {
							return;
						}

						if (hiddenSidebarContainer) {
							setHiddenSidebar(true);
						}
					}}
				>
					<DocSidebar
						key="api-sidebar"
						sidebar={sidebar}
						path={location.pathname}
						onCollapse={toggleSidebar}
						isHidden={hiddenSidebar}
					/>

					{hiddenSidebar && (
						<div
							className={styles.collapsedDocSidebar}
							title={translate({
								description: 'The ARIA label and title attribute for expand button of doc sidebar',
								id: 'theme.docs.sidebar.expandButtonTitle',
								message: 'Expand sidebar',
							})}
							aria-label={translate({
								description: 'The ARIA label and title attribute for expand button of doc sidebar',
								id: 'theme.docs.sidebar.expandButtonAriaLabel',
								message: 'Expand sidebar',
							})}
							tabIndex={0}
							role="button"
							onKeyDown={toggleSidebar}
							onClick={toggleSidebar}
						>
							<IconArrow className={styles.expandSidebarButtonIcon} />
						</div>
					)}
				</aside>

				<main
					className={clsx(styles.docMainContainer, {
						[styles.docMainContainerEnhanced]: hiddenSidebarContainer || !sidebar,
					})}
				>
					<div
						className={clsx('container padding-top--md padding-bottom--lg', styles.docItemWrapper, {
							[styles.docItemWrapperEnhanced]: hiddenSidebarContainer,
						})}
					>
						{children}
					</div>
				</main>
			</div>
		</Layout>
	);
}

export interface ApiPageProps {
	location: { pathname: string };
	sidebar: SidebarItem[];
}

function ApiPage({ data, location, sidebar }: ApiPageProps) {
	console.log({ data, sidebar });

	return (
		<ApiPageContent location={location} sidebar={sidebar}>
			{'test'}
		</ApiPageContent>
	);
}

export default ApiPage;
