import React from 'react';
import type { JSONOutput } from 'typedoc';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useGitRefName } from '../hooks/useGitRefName';

function replaceWithSrc(url: string): string {
	// Always link the source file
	return url.replace(/\/(dts|dist|lib|build|es|esm|cjs|mjs)\//, '/src/');
}

export interface SourceLinkProps {
	sources?: JSONOutput.SourceReference[];
}

export function SourceLink({ sources = [] }: SourceLinkProps) {
	const { siteConfig } = useDocusaurusContext();
	const gitRefName = useGitRefName();

	if (sources.length === 0) {
		return null;
	}

	return (
		<>
			{sources.map((source) => (
				<a
					key={source.fileName}
					className="tsd-anchor"
					href={
						// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
						source.url ||
						`https://${siteConfig.githubHost}${
							siteConfig.githubPort ? `:${siteConfig.githubPort}` : ''
						}/${siteConfig.organizationName}/${
							siteConfig.projectName
						}/blob/${gitRefName}/${replaceWithSrc(source.fileName)}#L${source.line}`
					}
					rel="noreferrer"
					target="_blank"
				>
					<i className="codicon codicon-file-code" />
				</a>
			))}
		</>
	);
}
