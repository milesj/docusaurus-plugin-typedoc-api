import React from 'react';
import { PageMetadata } from '@docusaurus/theme-common';
import type { Props as DocItemProps } from '@theme/DocItem';
import ApiItemLayout from './ApiItemLayout';

export interface ApiChangelogProps extends Pick<DocItemProps, 'route' | 'versionMetadata'> {
	changelog: DocItemProps['content'];
}

export default function ApiChangelog({
	changelog: Changelog,
	route,
	versionMetadata,
}: ApiChangelogProps) {
	return (
		<ApiItemLayout
			heading="Changelog"
			pageMetadata={<PageMetadata description={Changelog.contentTitle} title="Changelog | API" />}
			route={route}
			toc={Changelog.toc}
			versionMetadata={versionMetadata}
		>
			{Changelog && (
				<section className="tsd-readme">
					<Changelog />
				</section>
			)}
		</ApiItemLayout>
	);
}
