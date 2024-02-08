/* eslint-disable no-console, sort-keys */

import fs from 'fs';
import path from 'path';
import type { Options as MDXLoaderOptions } from '@docusaurus/mdx-loader';
import type { PropVersionDocs, PropVersionMetadata } from '@docusaurus/plugin-content-docs';
import { CURRENT_VERSION_NAME } from '@docusaurus/plugin-content-docs/server';
import type { LoadContext, Plugin, RouteConfig } from '@docusaurus/types';
import { DEFAULT_PLUGIN_ID, normalizeUrl } from '@docusaurus/utils';
import {
	flattenAndGroupPackages,
	formatPackagesWithoutHostInfo,
	generateJson,
	loadPackageJsonAndDocs,
} from './plugin/data';
import { extractSidebar } from './plugin/sidebar';
import { getVersionedDocsDirPath, readVersionsMetadata } from './plugin/version';
import type {
	ApiOptions,
	DocusaurusPluginTypeDocApiOptions,
	LoadedContent,
	PackageEntryConfig,
	PackageReflectionGroup,
	ResolvedPackageConfig,
	TSDDeclarationReflection,
	VersionMetadata,
} from './types';

const DEFAULT_OPTIONS: Required<DocusaurusPluginTypeDocApiOptions> = {
	banner: '',
	breadcrumbs: true,
	changelogName: 'CHANGELOG.md',
	changelogs: false,
	debug: false,
	disableVersioning: false,
	exclude: [],
	gitRefName: 'master',
	id: DEFAULT_PLUGIN_ID,
	includeCurrentVersion: true,
	lastVersion: '',
	minimal: false,
	onlyIncludeVersions: [],
	packageJsonName: 'package.json',
	packages: [],
	projectRoot: '.',
	sortPackages: (a, d) => a.packageName.localeCompare(d.packageName),
	sortSidebar: (a, d) => a.localeCompare(d),
	readmeName: 'README.md',
	readmes: false,
	removeScopes: [],
	routeBasePath: 'api',
	tsconfigName: 'tsconfig.json',
	typedocOptions: {},
	remarkPlugins: [],
	rehypePlugins: [],
	versions: {},
};

async function importFile<T>(file: string): Promise<T> {
	const data = await fs.promises.readFile(file, 'utf8');

	if (file.endsWith('.json')) {
		return JSON.parse(data) as T;
	}

	return data as unknown as T;
}

export default function typedocApiPlugin(
	context: LoadContext,
	pluginOptions: DocusaurusPluginTypeDocApiOptions,
): Plugin<LoadedContent> {
	const options: Required<DocusaurusPluginTypeDocApiOptions> = {
		...DEFAULT_OPTIONS,
		...pluginOptions,
	};
	const {
		banner,
		breadcrumbs,
		changelogs,
		id: pluginId,
		gitRefName,
		minimal,
		projectRoot,
		readmes,
		removeScopes,
	} = options;
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
				path: pkgConfig.entry ? String(pkgConfig.entry) : 'src/index.ts',
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
			packageRoot: path.normalize(path.join(projectRoot, pkgConfig.path || '.')),
			packagePath: pkgConfig.path || '.',
			packageSlug: pkgConfig.slug ?? path.basename(pkgConfig.path),
			// Load later on
			packageName: '',
			packageVersion: '',
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
					const prefix = isDefaultPluginId ? 'api' : pluginId;

					console.log(`[${prefix}]:`, 'Generating docs...');

					await generateJson(
						projectRoot,
						entryPoints,
						path.join(outDir, 'api-typedoc.json'),
						options,
					);

					console.log(`[${prefix}]:`, 'Persisting packages...');

					// Load info from `package.json`s
					packageConfigs.forEach((cfg) => {
						const { packageJson } = loadPackageJsonAndDocs(
							path.join(options.projectRoot, cfg.packagePath),
							options.packageJsonName,
							options.readmeName,
							options.changelogName,
						);

						// eslint-disable-next-line no-param-reassign
						cfg.packageName = packageJson.name;
						// eslint-disable-next-line no-param-reassign
						cfg.packageVersion = packageJson.version;
					});

					await fs.promises.writeFile(
						path.join(outDir, 'api-packages.json'),
						JSON.stringify(packageConfigs),
						'utf8',
					);

					console.log(`[${prefix}]:`, `version ${version} created!`);
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
								true,
							);
						}

						packages.sort((a, d) => options.sortPackages(a, d));

						// Generate sidebars (this runs before the main sidebar is loaded)
						const sidebars = extractSidebar(
							packages,
							removeScopes,
							changelogs,
							options.sortSidebar,
						);

						await fs.promises.writeFile(
							path.join(
								context.generatedFilesDir,
								`api-sidebar-${pluginId}-${metadata.versionName}.js`,
							),
							`module.exports = ${JSON.stringify(sidebars, null, 2)};`,
						);

						await fs.promises.writeFile(
							path.join(
								context.generatedFilesDir,
								`api-sidebar-${pluginId}-${metadata.versionName}.d.ts`,
							),
							`import type { SidebarConfig } from '@docusaurus/plugin-content-docs';\nexport = Array<SidebarConfig>;`,
						);

						return {
							...metadata,
							packages,
							sidebars,
						};
					}),
				),
			};
		},

		async contentLoaded({ content, actions }) {
			if (!content) {
				return;
			}

			const docs: PropVersionDocs = {};

			// Create an index of versions for quick lookups.
			// This is hacky, but it works, so shrug.
			content.loadedVersions.forEach((loadedVersion) => {
				if (loadedVersion.versionName !== CURRENT_VERSION_NAME) {
					docs[loadedVersion.versionName] = {
						id: loadedVersion.versionPath,
						title: loadedVersion.versionLabel,
						description: loadedVersion.versionLabel,
					};
				}
			});

			const rootRoutes = await Promise.all(
				content.loadedVersions.map(async (loadedVersion) => {
					const version = loadedVersion.versionName;

					// Define version metadata for all pages. We need to use the same structure as
					// "docs" so that we can utilize the same React components.
					// https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-plugin-content-docs/src/index.ts#L337
					const versionMetadata = await actions.createData(
						`version-${version}.json`,
						JSON.stringify({
							badge: loadedVersion.versionBadge,
							banner: loadedVersion.versionBanner,
							className: loadedVersion.versionClassName,
							docs,
							docsSidebars: { api: loadedVersion.sidebars },
							isLast: loadedVersion.isLast,
							label: loadedVersion.versionLabel,
							noIndex: false,
							pluginId,
							version: loadedVersion.versionName,
						} satisfies PropVersionMetadata),
					);

					const packagesData = await actions.createData(
						`packages-${version}.json`,
						JSON.stringify(formatPackagesWithoutHostInfo(loadedVersion.packages)),
					);

					const optionsData = await actions.createData(
						'options.json',
						JSON.stringify({
							banner,
							breadcrumbs,
							gitRefName,
							minimal,
							pluginId,
							scopes: removeScopes,
						} satisfies ApiOptions),
					);

					function createRoute(
						info: TSDDeclarationReflection,
						modules?: Record<string, string>,
					): RouteConfig {
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

							// Map a top-level package route, otherwise `DocRoot` shows a page not found
							subRoutes.push(
								createRoute(
									entry.reflection,
									entry.index && readmes && pkg.readmePath ? { readme: pkg.readmePath } : undefined,
								),
							);

							if (entry.index && changelogs && pkg.changelogPath) {
								subRoutes.push({
									path: normalizeUrl([entry.reflection.permalink, 'changelog']),
									exact: true,
									component: path.join(__dirname, './components/ApiChangelog.js'),
									modules: { changelog: pkg.changelogPath },
									sidebar: 'api',
								});
							}

							routes.push(...subRoutes);
						});
					});

					const indexPermalink = normalizeUrl([loadedVersion.versionPath]);

					if (loadedVersion.packages.length > 1) {
						// Only write out the ApiIndex only when we have multiple packages
						// otherwise we will have 2 top-level entries in the route entries
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
					}

					// Wrap in the `DocVersionRoot` component:
					// https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-docs/src/routes.ts#L192
					return {
						path: indexPermalink,
						exact: false,
						component: '@theme/DocVersionRoot',
						routes: [
							{
								path: indexPermalink,
								exact: false,
								component: path.join(__dirname, './components/ApiPage.js'),
								routes,
								modules: {
									options: optionsData,
									packages: packagesData,
								},
							},
						],
						modules: {
							version: versionMetadata,
						},
						priority: loadedVersion.routePriority,
					};
				}),
			);

			// Wrap in the `DocsRoot` component:
			// https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-content-docs/src/routes.ts#L232
			actions.addRoute({
				path: normalizeUrl([context.baseUrl, options.routeBasePath ?? 'api']),
				exact: false,
				component: '@theme/DocsRoot',
				routes: rootRoutes,
			});
		},

		configureWebpack(config, isServer, utils) {
			if (!readmes && !changelogs) {
				return {};
			}

			// Whitelist the folders that this webpack rule applies to, otherwise we collide with the native
			// docs/blog plugins. We need to include the specific files only, as in polyrepo mode, the `cfg.packagePath`
			// can be project root (where the regular docs are too).
			const include = packageConfigs.flatMap((cfg) => {
				const list: string[] = [];
				if (readmes) {
					list.push(path.join(options.projectRoot, cfg.packagePath, options.readmeName));
				}
				if (changelogs) {
					list.push(path.join(options.projectRoot, cfg.packagePath, options.changelogName));
				}
				return list;
			});

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
										admonitions: true,
										remarkPlugins: options.remarkPlugins,
										rehypePlugins: options.rehypePlugins,
										siteDir: context.siteDir,
										staticDirs: [...context.siteConfig.staticDirectories, path.join(context.siteDir, 'static')],
										// Since this isn't a doc/blog page, we can get
										// away with it being a partial!
										isMDXPartial: () => true,
										markdownConfig: context.siteConfig.markdown,
									} satisfies MDXLoaderOptions,
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
