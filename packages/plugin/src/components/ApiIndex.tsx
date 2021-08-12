import React from 'react';
import { JSONOutput } from 'typedoc';
import Link from '@docusaurus/Link';
import { MainHeading } from '@theme/Heading';

export interface ApiIndexProps {
	packages: JSONOutput.ProjectReflection[];
}

export default function ApiIndex({ packages }: ApiIndexProps) {
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
											<li key={pkg.name}>
												<Link className="tsd-kind-icon" to={pkg.permalink}>
													{pkg.packageName}{' '}
													<span className="tsd-signature-symbol">v{pkg.packageVersion}</span>
												</Link>
											</li>
										))}
									</ul>
								</div>
							</section>
						</div>
					</article>
				</div>
			</div>
		</div>
	);
}
