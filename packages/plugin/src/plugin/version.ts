// BASED ON: https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-docs/src/versions.ts

import fs from 'fs';
import type { JSONOutput } from 'typedoc';
import { CURRENT_VERSION_NAME } from '@docusaurus/plugin-content-docs/lib/constants';
import { getVersionsFilePath } from '@docusaurus/plugin-content-docs/lib/versions';
import type { LoadContext } from '@docusaurus/types';
import { normalizeUrl } from '@docusaurus/utils';
import type { DocusaurusPluginTypeDocApiOptions, SidebarItem } from '../types';

type PluginOptions = DocusaurusPluginTypeDocApiOptions;

export interface VersionMetadata {
	versionName: string; // 1.0.0
	versionLabel: string; // Version 1.0.0
	versionPath: string; // /baseUrl/api/1.0.0
	versionBadge: boolean;
	versionClassName: string;
	isLast: boolean;
	routePriority: number | undefined; // -1 for the latest
}

export interface LoadedVersion extends VersionMetadata {
	api: JSONOutput.ProjectReflection;
	sidebars: SidebarItem;
}

export interface LoadedContent {
	loadedVersions: LoadedVersion[];
}

function readVersionsFile(siteDir: string, pluginId: string): string[] | null {
	const versionsFilePath = getVersionsFilePath(siteDir, pluginId);

	if (fs.existsSync(versionsFilePath)) {
		return JSON.parse(fs.readFileSync(versionsFilePath, 'utf8')) as string[];
	}

	return null;
}

function readVersionNames(
	siteDir: string,
	options: Pick<PluginOptions, 'disableVersioning' | 'id' | 'includeCurrentVersion'>,
): string[] {
	const versionFileContent = readVersionsFile(siteDir, options.id ?? 'default');

	if (!versionFileContent && options.disableVersioning) {
		throw new Error(
			`API: using "disableVersioning=${options.disableVersioning}" option on a non-versioned site does not make sense.`,
		);
	}

	const versions = options.disableVersioning ? [] : versionFileContent ?? [];

	if (options.includeCurrentVersion && !versions.includes(CURRENT_VERSION_NAME)) {
		versions.unshift(CURRENT_VERSION_NAME);
	}

	if (versions.length === 0) {
		throw new Error(
			`It is not possible to use API without any version. Please check the configuration of these options: "includeCurrentVersion=${options.includeCurrentVersion}", "disableVersioning=${options.disableVersioning}".`,
		);
	}

	return versions;
}

function filterVersions(
	versionNamesUnfiltered: string[],
	options: Pick<PluginOptions, 'onlyIncludeVersions'>,
) {
	if (options.onlyIncludeVersions && options.onlyIncludeVersions.length > 0) {
		return versionNamesUnfiltered.filter((name) => options.onlyIncludeVersions?.includes(name));
	}

	return versionNamesUnfiltered;
}

function getDefaultLastVersionName(versionNames: string[]) {
	if (versionNames.length === 1) {
		return versionNames[0];
	}
	return versionNames.find((versionName) => versionName !== CURRENT_VERSION_NAME);
}

function createVersionMetadata({
	versionName,
	versionNames,
	lastVersionName,
	context,
	options,
}: {
	versionName: string;
	versionNames: string[];
	lastVersionName: string | undefined;
	context: Pick<LoadContext, 'baseUrl' | 'i18n' | 'siteDir'>;
	options: PluginOptions;
}): VersionMetadata {
	const isLast = versionName === lastVersionName;
	const versionOptions = options.versions[versionName] ?? {};
	const versionLabel =
		versionOptions.label ?? versionName === CURRENT_VERSION_NAME ? 'Next' : versionName;
	let versionPathPart =
		versionOptions.path ?? versionName === CURRENT_VERSION_NAME ? 'next' : versionName;

	if (isLast) {
		versionPathPart = '';
	}

	const versionPath = normalizeUrl([context.baseUrl, options.routeBasePath ?? '', versionPathPart]);

	return {
		isLast: versionName === lastVersionName,
		routePriority: versionPathPart === '' ? -1 : undefined,
		versionBadge: options.versions[versionName]?.badge ?? versionNames.length !== 1,
		versionClassName: options.versions[versionName]?.className ?? `api-version-${versionName}`,
		versionLabel,
		versionName,
		versionPath,
	};
}

export function readVersionsMetadata(
	context: LoadContext,
	options: DocusaurusPluginTypeDocApiOptions,
): VersionMetadata[] {
	const versionNamesUnfiltered = readVersionNames(context.siteDir, options);
	const versionNames = filterVersions(versionNamesUnfiltered, options);
	const lastVersionName = options.lastVersion
		? options.lastVersion
		: getDefaultLastVersionName(versionNames);

	console.log({ versionNamesUnfiltered, versionNames, lastVersionName });

	return versionNames.map((versionName) =>
		createVersionMetadata({
			context,
			lastVersionName,
			options,
			versionName,
			versionNames,
		}),
	);
}
