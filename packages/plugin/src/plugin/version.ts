// BASED ON: https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-docs/src/versions.ts

import fs from 'fs';
import { CURRENT_VERSION_NAME } from '@docusaurus/plugin-content-docs/lib/constants';
import { getVersionsFilePath } from '@docusaurus/plugin-content-docs/lib/versions';
import type { LoadContext } from '@docusaurus/types';
import { normalizeUrl } from '@docusaurus/utils';
import type { DocusaurusPluginTypeDocApiOptions, VersionBanner, VersionMetadata } from '../types';

type PluginOptions = DocusaurusPluginTypeDocApiOptions;

function readVersionsFile(siteDir: string, pluginId: string): string[] | null {
	const versionsFilePath = getVersionsFilePath(siteDir, pluginId);

	if (fs.existsSync(versionsFilePath)) {
		return JSON.parse(fs.readFileSync(versionsFilePath, 'utf8')) as string[];
	}

	return null;
}

function readVersionNames(siteDir: string, options: PluginOptions): string[] {
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

function filterVersions(versionNamesUnfiltered: string[], options: PluginOptions) {
	if (options.onlyIncludeVersions && options.onlyIncludeVersions.length > 0) {
		return versionNamesUnfiltered.filter((name) => options.onlyIncludeVersions?.includes(name));
	}

	return versionNamesUnfiltered;
}

function getDefaultVersionBanner(
	versionName: string,
	versionNames: string[],
	lastVersionName?: string,
): VersionBanner | null {
	if (!lastVersionName || versionName === lastVersionName) {
		return null;
	}

	if (versionNames.indexOf(versionName) < versionNames.indexOf(lastVersionName)) {
		return 'unreleased';
	}

	return 'unmaintained';
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
	context: LoadContext;
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

	const versionPath = normalizeUrl([
		context.siteConfig.baseUrl,
		options.routeBasePath ?? 'api',
		versionPathPart,
	]);

	return {
		isLast: versionName === lastVersionName,
		routePriority: versionPathPart === '' ? -1 : undefined,
		versionBadge: versionOptions?.badge ?? versionNames.length !== 1,
		versionBanner: getDefaultVersionBanner(versionName, versionNames, lastVersionName),
		versionClassName: versionOptions?.className ?? `api-version-${versionName}`,
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
