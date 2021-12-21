import React from 'react';
import Link from '@docusaurus/Link';
import type { PropVersionMetadata } from '@docusaurus/plugin-content-docs';
import { ThemeClassNames } from '@docusaurus/theme-common';

interface VersionBannerProps {
	versionMetadata: PropVersionMetadata;
}

export function VersionBanner({ versionMetadata }: VersionBannerProps): JSX.Element | null {
	const { banner, version } = versionMetadata;

	if (!banner) {
		return null;
	}

	const latestVersion = Object.keys(versionMetadata.docs).sort().pop()!;
	const latestVersionInfo = versionMetadata.docs[latestVersion];

	return (
		<div
			className={`${ThemeClassNames.docs.docVersionBanner} alert alert--warning margin-bottom--md`}
			role="alert"
		>
			<div>
				{banner === 'unreleased' && <>This is documentation for an unreleased version.</>}
				{banner === 'unmaintained' && (
					<>
						This is documentation for version <b>{version}</b>.
					</>
				)}{' '}
				For the latest API, see version{' '}
				<b>
					<Link to={latestVersionInfo.id}>{latestVersionInfo.title}</Link>
				</b>
				.
			</div>
		</div>
	);
}
