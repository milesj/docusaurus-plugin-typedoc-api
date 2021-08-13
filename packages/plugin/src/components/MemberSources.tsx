// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.sources.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { TypeAndParent } from './TypeAndParent';

function replaceWithSrc(url: string): string {
	// Always link the source file
	return url.replace(/\/(dts|dist|lib|build|esm|mjs|cjs)\//, '/src/');
}

export interface MemberSourcesProps {
	reflection: JSONOutput.DeclarationReflection;
}

export function MemberSources({ reflection }: MemberSourcesProps) {
	const { siteConfig } = useDocusaurusContext();

	if (
		!reflection.implementationOf &&
		!reflection.inheritedFrom &&
		!reflection.overwrites &&
		!reflection.sources
	) {
		return null;
	}

	return (
		<aside className="tsd-sources">
			{reflection.implementationOf && (
				<p>
					Implementation of <TypeAndParent type={reflection.implementationOf} />
				</p>
			)}

			{reflection.inheritedFrom && (
				<p>
					Inherited from <TypeAndParent type={reflection.inheritedFrom} />
				</p>
			)}

			{reflection.overwrites && (
				<p>
					Overrides <TypeAndParent type={reflection.overwrites} />
				</p>
			)}

			{reflection.sources && reflection.sources.length > 0 && (
				<ul>
					{reflection.sources.map((source) => (
						<li key={source.fileName}>
							Defined in{' '}
							<a
								href={`https://github.com/${siteConfig.organizationName}/${
									siteConfig.projectName
								}/blob/master/${replaceWithSrc(source.fileName)}#L${source.line}`}
								rel="noreferrer"
								target="_blank"
							>
								{source.fileName}:{source.line}
							</a>
						</li>
					))}
				</ul>
			)}
		</aside>
	);
}