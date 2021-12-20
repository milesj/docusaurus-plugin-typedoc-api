/* eslint-disable sort-keys */

import fs from 'fs';
import path from 'path';
import type { JSONOutput } from 'typedoc';
import * as TypeDoc from 'typedoc';
import ts from 'typescript';
import type { PropVersionMetadata } from '@docusaurus/plugin-content-docs';
import type { LoadContext, Plugin, RouteConfig } from '@docusaurus/types';
import { DEFAULT_PLUGIN_ID, normalizeUrl } from '@docusaurus/utils';
import {
	extractMetadata,
	flattenAndGroupPackages,
	formatPackagesWithoutHostInfo,
} from './plugin/data';
import { extractSidebar } from './plugin/sidebar';
import { readVersionsMetadata } from './plugin/version';
import {
	DocusaurusPluginTypeDocApiOptions,
	PackageEntryConfig,
	PackageReflectionGroup,
	ResolvedPackageConfig,
} from './types';

// Persist build state as a global, since the plugin is re-evaluated every hot reload.
// Because of this, we can't use state in the plugin or module scope.
if (!global.typedocBuild) {
	global.typedocBuild = { count: 0 };
}

function shouldEmit(projectRoot: string, tsconfigPath: string) {
	const { config, error } = ts.readConfigFile(tsconfigPath, (name) =>
		fs.readFileSync(name, 'utf8'),
	);

	if (error) {
		throw new Error(`Failed to load ${tsconfigPath}`);
	}

	const result = ts.parseJsonConfigFileContent(config, ts.sys, projectRoot, {}, tsconfigPath);

	if (result.errors.length > 0) {
		throw new Error(`Failed to parse ${tsconfigPath}`);
	}

	return result.projectReferences && result.projectReferences.length > 0 ? 'docs' : 'none';
}

export default function typedocApiPlugin(
	context: LoadContext,
	pluginOptions: DocusaurusPluginTypeDocApiOptions,
): Plugin<JSONOutput.ProjectReflection> {
	const {
		debug = false,
		exclude = [],
		minimal,
		packages,
		projectRoot,
		readmes,
		tsconfigName = 'tsconfig.json',
		typedocOptions = {},
		...options
	} = pluginOptions;
	const pluginId = options.id ?? DEFAULT_PLUGIN_ID;
	const versionsMetadata = readVersionsMetadata(context, pluginOptions);

	console.log({ versionsMetadata });

	// Determine entry points from configs
	const entryPoints: string[] = [];
	const packageConfigs: ResolvedPackageConfig[] = packages.map((pkgItem) => {
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
			entryPoints.push(path.join(projectRoot, pkgConfig.path, entryConfig.path));
		});

		const absolutePath = path.join(projectRoot, pkgConfig.path);

		return {
			absolutePath,
			entryPoints: entries,
			packagePath: pkgConfig.path || '.',
			packageSlug: pkgConfig.slug ?? path.basename(absolutePath),
		};
	});

	// Store API data for easy access
	const apiPackages: PackageReflectionGroup[] = [];

	return {
		name: 'docusaurus-plugin-typedoc-api',

		extendCli(cli) {
			const isDefaultPluginId = pluginId === DEFAULT_PLUGIN_ID;

			// Need to create one distinct command per plugin instance
			// otherwise 2 instances would try to execute the command!
			const command = isDefaultPluginId ? 'api:version' : `api:version:${pluginId}`;
			const commandDescription = isDefaultPluginId
				? 'Tag a new API version'
				: `Tag a new API version (${pluginId})`;

			cli
				.command(command)
				.arguments('<version>')
				.description(commandDescription)
				.action((version) => {
					// TODO
				});
		},

		async loadContent() {
			const filePath = path.join(context.generatedFilesDir, 'typedoc.json');

			// Running the TypeDoc compiler is pretty slow...
			// We should only load on the 1st build, and use cache for subsequent reloads.
			if (global.typedocBuild.count > 0 && fs.existsSync(filePath)) {
				return import(filePath);
			}

			const app = new TypeDoc.Application();
			const tsconfig = path.join(projectRoot, tsconfigName);

			app.options.addReader(new TypeDoc.TSConfigReader());
			app.options.addReader(new TypeDoc.TypeDocReader());

			app.bootstrap({
				// Only emit when using project references
				emit: shouldEmit(projectRoot, tsconfig),
				// Only document the public API by default
				excludeExternals: true,
				excludeInternal: true,
				excludePrivate: true,
				excludeProtected: true,
				// Enable verbose logging when debugging
				logLevel: debug ? 'Verbose' : 'Info',
				...typedocOptions,
				// Control how config and packages are detected
				tsconfig,
				entryPoints,
				entryPointStrategy: 'expand',
				exclude,
				// We use a fake category title so that we can fallback to the parent group
				defaultCategory: 'CATEGORY',
			});

			const project = app.convert();

			if (project) {
				await app.generateJson(project, filePath);

				global.typedocBuild.count += 1;

				return import(filePath);
			}

			return undefined;
		},

		async contentLoaded({ content, actions }) {
			if (!content) {
				return;
			}

			const { createData, addRoute } = actions;

			apiPackages.push(
				...flattenAndGroupPackages(
					packageConfigs,
					// @ts-expect-error CJS/ESM interop sometimes returns under a default property
					content.default ?? content,
					context.siteConfig.baseUrl,
					pluginOptions,
				),
			);

			// Define version metadata for all pages. We need to use the same structure as
			// "docs" so that we can utilize the same React components.
			// https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-plugin-content-docs/src/index.ts#L337
			const versionMetadata: PropVersionMetadata = {
				pluginId,
				version: 'current',
				label: 'Current',
				isLast: true,
				banner: null,
				className: '',
				badge: false,
				docsSidebars: { api: await extractSidebar(apiPackages) },
				docs: {},
			};

			const versionMetadataData = await createData(
				`version-${versionMetadata.version}-metadata.json`,
				JSON.stringify(versionMetadata),
			);

			const packagesData = await createData(
				'packages.json',
				JSON.stringify(formatPackagesWithoutHostInfo(apiPackages)),
			);

			const optionsData = await createData('options.json', JSON.stringify({ minimal, pluginId }));

			async function createRoute(
				info: JSONOutput.Reflection,
				readmePath?: string,
			): Promise<RouteConfig> {
				const reflection = extractMetadata(info);
				const reflectionData = await createData(
					`reflection-${reflection.id}.json`,
					JSON.stringify(reflection),
				);
				const modules = {
					content: reflectionData,
				};

				// Rely on mdx to convert the file path to a component
				if (readmes && readmePath) {
					Object.assign(modules, {
						readme: readmePath,
					});
				}

				return {
					path: reflection.permalink,
					exact: true,
					component: path.join(__dirname, './components/ApiItem.js'),
					modules,
					sidebar: 'api',
				};
			}

			const routes: RouteConfig[] = [];

			await Promise.all(
				apiPackages.map(async (pkg) => {
					await Promise.all(
						pkg.entryPoints.map(async (entry) => {
							const children =
								entry.reflection.children?.filter((child) => !child.permalink?.includes('#')) ?? [];

							// Map a route for every declaration in the package (the exported APIs)
							const subRoutes = await Promise.all(
								children.map(async (child) => createRoute(child)),
							);

							// Map a top-level package route, otherwise `DocPage` shows a page not found
							subRoutes.push(
								await createRoute(entry.reflection, entry.index ? pkg.readmePath : undefined),
							);

							routes.push(...subRoutes);
						}),
					);
				}),
			);

			const apiIndexPermalink = normalizeUrl([context.siteConfig.baseUrl, '/api']);

			routes.push({
				path: apiIndexPermalink,
				exact: true,
				component: path.join(__dirname, './components/ApiIndex.js'),
				modules: {
					packages: packagesData,
				},
				sidebar: 'api',
			});

			addRoute({
				path: apiIndexPermalink,
				exact: false,
				component: path.join(__dirname, './components/ApiPage.js'),
				routes,
				modules: {
					options: optionsData,
					packages: packagesData,
					versionMetadata: versionMetadataData,
				},
			});
		},

		configureWebpack(config, isServer, utils) {
			if (!readmes) {
				return {};
			}

			// Whitelist the folders that this webpack rule applies to,
			// otherwise we collide with the native docs/blog plugins.
			const include = packageConfigs.map((cfg) => cfg.absolutePath);

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
