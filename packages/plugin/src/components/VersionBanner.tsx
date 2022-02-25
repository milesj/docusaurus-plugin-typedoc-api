import React, { useCallback } from 'react';
import Link from '@docusaurus/Link';
import type { PropVersionMetadata } from '@docusaurus/plugin-content-docs';
import { useDocVersionSuggestions } from '@docusaurus/plugin-content-docs/client';
import { ThemeClassNames, useDocsPreferredVersion } from '@docusaurus/theme-common';

interface VersionBannerProps {
	versionMetadata: PropVersionMetadata;
}

export function VersionBanner({ versionMetadata }: VersionBannerProps): JSX.Element | null {
	const { banner, pluginId, version } = versionMetadata;
	const { latestVersionSuggestion: latestVersion } = useDocVersionSuggestions(pluginId);
	const { savePreferredVersionName } = useDocsPreferredVersion(pluginId);

	const handleClick = useCallback(() => {
		savePreferredVersionName(latestVersion.name);
	}, [latestVersion.name, savePreferredVersionName]);

	if (!banner || !latestVersion) {
		return null;
	}

	const latestVersionInfo = versionMetadata.docs[latestVersion.label];

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
					<Link to={latestVersionInfo.id} onClick={handleClick}>
						{latestVersionInfo.title}
					</Link>
				</b>
				.
			</div>
		</div>
	);
}
