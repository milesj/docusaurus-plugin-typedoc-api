import React from 'react';
import Link from '@docusaurus/Link';
import type { PropVersionMetadata } from '@docusaurus/plugin-content-docs';
import { ThemeClassNames } from '@docusaurus/theme-common';

interface VersionBannerProps {
	versionMetadata: PropVersionMetadata;
}

function BannerLabel({ versionMetadata }: VersionBannerProps) {
	const { banner, version } = versionMetadata;

	switch (banner) {
		case 'unreleased':
			return <>This is an unreleased API for the next version.</>;
		case 'unmaintained':
			return (
				<>
					This is an API for version <b>{version}</b>, which is no longer actively maintained.
				</>
			);
		default:
			return null;
	}
}

function LatestVersionSuggestionLabel({ versionLabel, to }: { to: string; versionLabel: string }) {
	return (
		<>
			For an up-to-date API, see the{' '}
			<b>
				<Link to={to}>latest version</Link>
			</b>{' '}
			({versionLabel}).
		</>
	);
}

function VersionBannerEnabled({ versionMetadata }: VersionBannerProps) {
	const version = Object.keys(versionMetadata.docs).sort().pop()!;
	const versionInfo = versionMetadata.docs[version];

	return (
		<div
			className={`${ThemeClassNames.docs.docVersionBanner} alert alert--warning margin-bottom--md`}
			role="alert"
		>
			<div>
				<BannerLabel versionMetadata={versionMetadata} />
			</div>
			<div className="margin-top--md">
				<LatestVersionSuggestionLabel to={versionInfo.id} versionLabel={versionInfo.title} />
			</div>
		</div>
	);
}

export function VersionBanner({ versionMetadata }: VersionBannerProps): JSX.Element | null {
	if (versionMetadata.banner) {
		return <VersionBannerEnabled versionMetadata={versionMetadata} />;
	}

	return null;
}
