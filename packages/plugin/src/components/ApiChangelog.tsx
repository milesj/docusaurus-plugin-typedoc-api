import React from 'react';
import { PageMetadata } from '@docusaurus/theme-common';
import type { Props as DocItemProps } from '@theme/DocItem';
import type { TOCItem } from '../types';
import ApiItemLayout from './ApiItemLayout';

export interface ApiChangelogProps extends Pick<DocItemProps, 'route'> {
	changelog: DocItemProps['content'];
}

const emptyToc: TOCItem[] = [];

export default function ApiChangelog({ changelog: Changelog, route }: ApiChangelogProps) {
	return (
		<ApiItemLayout
			heading="Changelog"
			pageMetadata={<PageMetadata description={Changelog.contentTitle} title="Changelog | API" />}
			route={route}
			toc={Changelog.toc ?? emptyToc}
		>
			<section className="tsd-readme">
				<Changelog />
			</section>
		</ApiItemLayout>
	);
}
