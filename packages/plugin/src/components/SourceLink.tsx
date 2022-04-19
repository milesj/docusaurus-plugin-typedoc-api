import React, { useContext } from 'react';
import type { JSONOutput } from 'typedoc';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { ApiDataContext } from './ApiDataContext';

function replaceWithSrc(url: string): string {
	// Always link the source file
	return url.replace(/\/(dts|dist|lib|build|es|esm|cjs|mjs)\//, '/src/');
}

export function useGitRefName(): string {
	return useContext(ApiDataContext).options.gitRefName;
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
					href={`https://github.com/${siteConfig.organizationName}/${
						siteConfig.projectName
					}/blob/${gitRefName}/${replaceWithSrc(source.fileName)}#L${source.line}`}
					rel="noreferrer"
					target="_blank"
				>
					<i className="codicon codicon-file-code" />
				</a>
			))}
		</>
	);
}
