/* eslint-disable sort-keys */

import fs from 'fs';
import path from 'path';
import type { JSONOutput } from 'typedoc';
import type { PropVersionDocs, PropVersionMetadata } from '@docusaurus/plugin-content-docs';
import { CURRENT_VERSION_NAME } from '@docusaurus/plugin-content-docs/server';
import type { LoadContext, Plugin, RouteConfig } from '@docusaurus/types';
import { DEFAULT_PLUGIN_ID, normalizeUrl } from '@docusaurus/utils';
import {
	flattenAndGroupPackages,
	formatPackagesWithoutHostInfo,
	generateJson,
} from './plugin/data';
import { extractSidebar } from './plugin/sidebar';
import { getVersionedDocsDirPath, readVersionsMetadata } from './plugin/version';
import {
	DocusaurusPluginTypeDocApiOptions,
	LoadedContent,
	PackageEntryConfig,
	PackageReflectionGroup,
	ResolvedPackageConfig,
	VersionMetadata,
} from './types';

const DEFAULT_OPTIONS: Required<DocusaurusPluginTypeDocApiOptions> = {
	debug: false,
	disableVersioning: false,
	exclude: [],
	id: DEFAULT_PLUGIN_ID,
	includeCurrentVersion: true,
	lastVersion: '',
	minimal: false,
	onlyIncludeVersions: [],
	packageJsonName: 'package.json',
	packages: [],
	projectRoot: '.',
	readmeName: 'README.md',
	readmes: false,
	routeBasePath: 'api',
	tsconfigName: 'tsconfig.json',
	typedocOptions: {},
	versions: {},
};

async function importFile<T>(file: string): Promise<T> {
	// eslint-disable-next-line promise/prefer-await-to-then
	return import(file).then((res) => res.default as T);
}

export default function typedocApiPlugin(
	context: LoadContext,
	pluginOptions: DocusaurusPluginTypeDocApiOptions,
): Plugin<LoadedContent> {
	const options: Required<DocusaurusPluginTypeDocApiOptions> = {
		...DEFAULT_OPTIONS,
		...pluginOptions,
	};
	const { id: pluginId, minimal, projectRoot, readmes } = options;
	const isDefaultPluginId = pluginId === DEFAULT_PLUGIN_ID;
	const versionsMetadata = readVersionsMetadata(context, options);
	const versionsDocsDir = getVersionedDocsDirPath(context.siteDir, pluginId);

	// Determine entry points from configs
	const entryPoints: string[] = [];
	const packageConfigs: ResolvedPackageConfig[] = options.packages.map((pkgItem) => {
		const pkgConfig = typeof pkgItem === 'string' ? { path: pkgItem } : pkgItem;
		const entries: Record<string, PackageEntryConfig> = {};

		if (!pkgConfig.entry || typeof pkgConfig.entry === 'string') {
			entries.index = {
				label: 'Index',
				path: pkgConfig.entry ?? 'src/index.ts',
			};
		} else {
			Object.entries(pkgConfig.entry).forEach(([importPath, entryConfig]) => {
				entries[importPath] =
					typeof entryConfig === 'string'
						? {
								label: 'Index',
								path: entryConfig,
						  }
						: entryConfig;
			});
		}

		Object.values(entries).forEach((entryConfig) => {
			entryPoints.push(path.join(pkgConfig.path, entryConfig.path));
		});

		return {
			entryPoints: entries,
			packagePath: pkgConfig.path || '.',
			packageSlug: pkgConfig.slug ?? path.basename(pkgConfig.path),
		};
	});

	return {
		name: 'docusaurus-plugin-typedoc-api',

		extendCli(cli) {
			const command = isDefaultPluginId ? 'api:version' : `api:version:${pluginId}`;
			const commandDescription = isDefaultPluginId
				? 'Tag a new API version'
				: `Tag a new API version (${pluginId})`;

			cli
				.command(command)
				.arguments('<version>')
				.description(commandDescription)
				.action(async (version) => {
					const outDir = path.join(versionsDocsDir, `version-${version}`);

					await generateJson(
						projectRoot,
						entryPoints,
						path.join(outDir, 'api-typedoc.json'),
						options,
					);

					await fs.promises.writeFile(
						path.join(outDir, 'api-packages.json'),
						JSON.stringify(packageConfigs),
						'utf8',
					);

					// eslint-disable-next-line no-console
					console.log(`[${isDefaultPluginId ? 'api' : pluginId}]: version ${version} created!`);
				});
		},

		async loadContent() {
			const versionsMetadataList = await versionsMetadata;

			return {
				loadedVersions: await Promise.all(
					versionsMetadataList.map(async (metadata: VersionMetadata) => {
						let packages: PackageReflectionGroup[] = [];

						// Current data needs to be generated on demand
						if (metadata.versionName === CURRENT_VERSION_NAME) {
							const outFile = path.join(context.generatedFilesDir, `api-typedoc-${pluginId}.json`);

							await generateJson(projectRoot, entryPoints, outFile, options);

							packages = flattenAndGroupPackages(
								packageConfigs,
								await importFile(outFile),
								metadata.versionPath,
								options,
							);

							// Versioned data is stored in the file system
						} else {
							const outDir = path.join(versionsDocsDir, `version-${metadata.versionName}`);

							packages = flattenAndGroupPackages(
								await importFile(path.join(outDir, 'api-packages.json')),
								await importFile(path.join(outDir, 'api-typedoc.json')),
								metadata.versionPath,
								options,
							);
						}

						return {
							...metadata,
							packages,
							sidebars: await extractSidebar(packages),
						};
					}),
				),
			};
		},

		async contentLoaded({ content, actions }) {
			if (!content) {
				return;
			}

			const { createData, addRoute } = actions;
			const docs: PropVersionDocs = {};

			// Create an index of versions for quick lookups.
			// This is hacky, but it works, so shrug.
			content.loadedVersions.forEach((loadedVersion) => {
				if (loadedVersion.versionName !== CURRENT_VERSION_NAME) {
					docs[loadedVersion.versionName] = {
						id: loadedVersion.versionPath,
						title: loadedVersion.versionLabel,
					};
				}
			});

			await Promise.all(
				content.loadedVersions.map(async (loadedVersion) => {
					const version = loadedVersion.versionName;

					// Define version metadata for all pages. We need to use the same structure as
					// "docs" so that we can utilize the same React components.
					// https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-plugin-content-docs/src/index.ts#L337
					const versionMetadata = await createData(
						`version-${version}.json`,
						JSON.stringify({
							badge: loadedVersion.versionBadge,
							banner: loadedVersion.versionBanner,
							className: loadedVersion.versionClassName,
							docs,
							docsSidebars: { api: loadedVersion.sidebars },
							isLast: loadedVersion.isLast,
							label: loadedVersion.versionLabel,
							pluginId,
							version: loadedVersion.versionName,
						} as PropVersionMetadata),
					);

					const packagesData = await createData(
						`packages-${version}.json`,
						JSON.stringify(formatPackagesWithoutHostInfo(loadedVersion.packages)),
					);

					const optionsData = await createData(
						'options.json',
						JSON.stringify({ minimal, pluginId }),
					);

					function createRoute(info: JSONOutput.Reflection, readmePath?: string): RouteConfig {
						const modules = {};

						// Rely on mdx to convert the file path to a component
						if (readmes && readmePath) {
							Object.assign(modules, {
								readme: readmePath,
							});
						}

						return {
							path: info.permalink,
							exact: true,
							component: path.join(__dirname, './components/ApiItem.js'),
							modules,
							sidebar: 'api',
							// Map the ID here instead of creating a JSON data file,
							// otherwise this will create thousands of files!
							id: info.id,
						};
					}

					const routes: RouteConfig[] = [];

					loadedVersion.packages.forEach((pkg) => {
						pkg.entryPoints.forEach((entry) => {
							const children =
								entry.reflection.children?.filter((child) => !child.permalink?.includes('#')) ?? [];

							// Map a route for every declaration in the package (the exported APIs)
							const subRoutes = children.map((child) => createRoute(child));

							// Map a top-level package route, otherwise `DocPage` shows a page not found
							subRoutes.push(
								createRoute(entry.reflection, entry.index ? pkg.readmePath : undefined),
							);

							routes.push(...subRoutes);
						});
					});

					const indexPermalink = normalizeUrl([loadedVersion.versionPath]);

					routes.push({
						path: indexPermalink,
						exact: true,
						component: path.join(__dirname, './components/ApiIndex.js'),
						modules: {
							options: optionsData,
							packages: packagesData,
							versionMetadata,
						},
						sidebar: 'api',
					});

					addRoute({
						path: indexPermalink,
						exact: false,
						component: path.join(__dirname, './components/ApiPage.js'),
						routes,
						modules: {
							options: optionsData,
							packages: packagesData,
							versionMetadata,
						},
						priority: loadedVersion.routePriority,
					});
				}),
			);
		},

		configureWebpack(config, isServer, utils) {
			if (!readmes) {
				return {};
			}

			// Whitelist the folders that this webpack rule applies to,
			// otherwise we collide with the native docs/blog plugins.
			const include = packageConfigs.map((cfg) => path.join(options.projectRoot, cfg.packagePath));

			return {
				module: {
					rules: [
						{
							test: /\.mdx?$/,
							include,
							use: [
								utils.getJSLoader({ isServer }),
								{
									loader: require.resolve('@docusaurus/mdx-loader'),
									options: {
										staticDir: path.join(context.siteDir, 'static'),
										// Since this isnt a doc/blog page, we can get
										// away with it being a partial!
										isMDXPartial: () => true,
									},
								},
								{
									loader: path.resolve(__dirname, './markdownLoader.js'),
								},
							],
						},
					],
				},
			};
		},
	};
}
