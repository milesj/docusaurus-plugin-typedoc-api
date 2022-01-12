import React, { useEffect } from 'react';
import Link from '@docusaurus/Link';
import { useDocsPreferredVersion } from '@docusaurus/theme-common';
import type { Props as DocItemProps } from '@theme/DocItem';
import { MainHeading } from '@theme/Heading';
import { GlobalVersion, useLatestVersion } from '@theme/hooks/useDocs';
import { PackageReflectionGroup } from '../types';
import { Footer } from './Footer';
import { VersionBanner } from './VersionBanner';

export interface ApiIndexProps extends Pick<DocItemProps, 'route' | 'versionMetadata'> {
	history: {
		location: { pathname: string };
		replace: (path: string) => void;
	};
	packages: PackageReflectionGroup[];
}

function addVersionToUrl(
	url: string,
	latestVersion: GlobalVersion,
	preferredVersion: GlobalVersion | null | undefined,
) {
	if (
		!url.match(/api\/(\d\.\d\.\d)/) &&
		!url.includes('api/next') &&
		preferredVersion &&
		preferredVersion.name !== latestVersion.name
	) {
		const version = preferredVersion.name === 'current' ? 'next' : preferredVersion.name;

		if (url.endsWith('/api')) {
			return `${url}/${version}`;
		}

		return url.replace('/api/', `/api/${version}/`);
	}

	return url;
}

export default function ApiIndex({ packages, history, versionMetadata }: ApiIndexProps) {
	const latestVersion = useLatestVersion();
	const { preferredVersion } = useDocsPreferredVersion(versionMetadata.pluginId);

	useEffect(() => {
		// Redirect to package when only 1
		if (packages.length === 1) {
			history.replace(
				addVersionToUrl(
					packages[0].entryPoints[0].reflection.permalink,
					latestVersion,
					preferredVersion,
				),
			);

			// Redirect to preferred version
		} else if (preferredVersion) {
			history.replace(addVersionToUrl(history.location.pathname, latestVersion, preferredVersion));
		}
	}, [packages, history, latestVersion, preferredVersion]);

	return (
		<div className="row">
			<div className="col apiItemCol">
				<VersionBanner versionMetadata={versionMetadata} />

				<div className="apiItemContainer">
					<article>
						<div className="markdown">
							<MainHeading>API</MainHeading>

							<section className="tsd-panel">
								<h3 className="tsd-panel-header">Packages</h3>
								<div className="tsd-panel-content">
									<ul className="tsd-index-list">
										{packages.map((pkg) => (
											<li key={pkg.packageName} className="tsd-truncate">
												<Link
													className="tsd-kind-icon"
													to={pkg.entryPoints[0].reflection.permalink}
												>
													<span className="tsd-signature-symbol">v{pkg.packageVersion}</span>{' '}
													<span>{pkg.packageName}</span>
												</Link>
											</li>
										))}
									</ul>
								</div>
							</section>
						</div>

						<Footer />
					</article>
				</div>
			</div>
		</div>
	);
}
