// BASED ON: https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-docs/src/versions.ts

import path from 'path';
import type { PluginOptions as DocusaurusNativePluginOptions } from '@docusaurus/plugin-content-docs';
import {
	CURRENT_VERSION_NAME,
	filterVersions,
	getDefaultVersionBanner,
	readVersionNames,
	VERSIONED_DOCS_DIR,
} from '@docusaurus/plugin-content-docs/server';
import type { LoadContext } from '@docusaurus/types';
import { DEFAULT_PLUGIN_ID, normalizeUrl } from '@docusaurus/utils';
import type { DocusaurusPluginTypeDocApiOptions, VersionMetadata } from '../types';

type PluginOptions = DocusaurusPluginTypeDocApiOptions;

export function getVersionedDocsDirPath(siteDir: string, pluginId: string): string {
	return path.join(
		siteDir,
		pluginId === DEFAULT_PLUGIN_ID ? VERSIONED_DOCS_DIR : `${pluginId}_${VERSIONED_DOCS_DIR}`,
	);
}

function getDefaultLastVersionName(versionNames: string[]): string {
	if (versionNames.length === 1) {
		return versionNames[0];
	}

	return versionNames.find((versionName) => versionName !== CURRENT_VERSION_NAME) ?? '';
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
	lastVersionName: string;
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
		versionBanner: getDefaultVersionBanner({
			context,
			lastVersionName,
			// @ts-expect-error Ignore internal options
			options,
			versionName,
			versionNames,
		}),
		versionClassName: versionOptions?.className ?? `api-version-${versionName}`,
		versionLabel,
		versionName,
		versionPath,
	};
}

export async function readVersionsMetadata(
	context: LoadContext,
	options: DocusaurusPluginTypeDocApiOptions,
): Promise<VersionMetadata[]> {
	// Docusaurus internals require *every* option, but the versioning
	// does not actually use them. We are casting the types here to
	// ignore all the missing properties.
	const specialOptions = options as DocusaurusNativePluginOptions &
		DocusaurusPluginTypeDocApiOptions;

	const versionNamesUnfiltered = await readVersionNames(context.siteDir, {
		...specialOptions,
		disableVersioning: options.disableVersioning ?? false,
		id: options.id ?? 'default',
		includeCurrentVersion: options.includeCurrentVersion ?? true,
	});
	const versionNames = filterVersions(versionNamesUnfiltered, {
		...specialOptions,
		onlyIncludeVersions:
			options.onlyIncludeVersions && options.onlyIncludeVersions.length > 0
				? options.onlyIncludeVersions
				: undefined,
	});
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
