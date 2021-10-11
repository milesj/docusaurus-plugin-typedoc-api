import React, { useEffect } from 'react';
import Link from '@docusaurus/Link';
import { MainHeading } from '@theme/Heading';
import { PackageReflectionGroup } from '../types';
import { Footer } from './Footer';

export interface ApiIndexProps {
	history: {
		replace: (path: string) => void;
	};
	packages: PackageReflectionGroup[];
}

export default function ApiIndex({ packages, history }: ApiIndexProps) {
	useEffect(() => {
		// Redirect to package when only 1
		if (packages.length === 1) {
			history.replace(packages[0].entryPoints[0].reflection.permalink);
		}
	}, [packages, history]);

	return (
		<div className="row">
			<div className="col apiItemCol">
				<div className="apiItemContainer">
					<article>
						<div className="markdown">
							<MainHeading>API</MainHeading>

							<section className="tsd-panel">
								<h3 className="tsd-panel-header">Packages</h3>
								<div className="tsd-panel-content">
									<ul className="tsd-index-list">
										{packages.map((pkg) => (
											<li key={pkg.packageName}>
												<Link
													className="tsd-kind-icon"
													to={pkg.entryPoints[0].reflection.permalink}
												>
													{pkg.packageName}{' '}
													<span className="tsd-signature-symbol">v{pkg.packageVersion}</span>
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
