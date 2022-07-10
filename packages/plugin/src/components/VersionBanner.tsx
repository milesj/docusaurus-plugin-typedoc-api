import React, { useCallback } from 'react';
import Link from '@docusaurus/Link';
import { useDocVersionSuggestions } from '@docusaurus/plugin-content-docs/client';
import { ThemeClassNames, useDocsPreferredVersion } from '@docusaurus/theme-common';
import { useDocsVersion } from '@docusaurus/theme-common/internal';

export function VersionBanner(): JSX.Element | null {
	const { banner, docs, pluginId, version } = useDocsVersion();
	const { latestVersionSuggestion: latestVersion } = useDocVersionSuggestions(pluginId);
	const { savePreferredVersionName } = useDocsPreferredVersion(pluginId);

	const handleClick = useCallback(() => {
		savePreferredVersionName(latestVersion.name);
	}, [latestVersion.name, savePreferredVersionName]);

	if (!banner || !latestVersion) {
		return null;
	}

	const latestVersionInfo = docs[latestVersion.label];

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
