/* eslint-disable sort-keys */

import fs from 'fs';
import path from 'path';
import type { JSONOutput } from 'typedoc';
import * as TypeDoc from 'typedoc';
import type { PropVersionMetadata } from '@docusaurus/plugin-content-docs-types';
import type { LoadContext, Plugin, RouteConfig } from '@docusaurus/types';
import {
	extractMetadata,
	flattenAndGroupPackages,
	formatPackagesWithoutHostInfo,
} from './plugin/data';
import { extractSidebar } from './plugin/sidebar';
import {
	PackageConfig,
	PackageEntryConfig,
	PackageReflectionGroup,
	ResolvedPackageConfig,
} from './types';

export interface DocusaurusPluginTypedocApiOptions {
	exclude?: string[];
	id?: string;
	minimal?: boolean;
	packages: (PackageConfig | string)[];
	projectRoot: string;
	readmes?: boolean;
}

export default function typedocApiPlugin(
	context: LoadContext,
	{
		exclude = [],
		minimal,
		packages,
		projectRoot,
		readmes,
		...options
	}: DocusaurusPluginTypedocApiOptions,
): Plugin<JSONOutput.ProjectReflection> {
	const pluginId = options.id ?? 'default';

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

		return {
			absolutePath: path.join(projectRoot, pkgConfig.path),
			entryPoints: entries,
			packagePath: pkgConfig.path,
		};
	});

	// Store API data for easy access
	const apiPackages: PackageReflectionGroup[] = [];

	return {
		name: 'docusaurus-plugin-typedoc-api',

		async loadContent() {
			const filePath = path.join(context.generatedFilesDir, 'typedoc.json');

			if (fs.existsSync(filePath)) {
				return import(filePath);
			}

			const app = new TypeDoc.Application();

			app.options.addReader(new TypeDoc.TSConfigReader());
			app.options.addReader(new TypeDoc.TypeDocReader());

			app.bootstrap({
				tsconfig: path.join(projectRoot, 'tsconfig.json'),
				emit: true,
				entryPoints,
				exclude,
				excludeExternals: true,
				excludeInternal: true,
				excludePrivate: true,
				excludeProtected: true,
				// We use a fake category title so that we can fallback to the parent group
				defaultCategory: 'CATEGORY',
			});

			const project = app.convert();

			if (project) {
				await app.generateJson(project, filePath);

				return import(filePath);
			}

			return undefined;
		},

		async contentLoaded({ content, actions }) {
			if (!content) {
				return;
			}

			const { createData, addRoute } = actions;

			apiPackages.push(...flattenAndGroupPackages(packageConfigs, content));

			// Define version metadata for all pages. We need to use the same structure as
			// "docs" so that we can utilize the same React components.
			// https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-plugin-content-docs/src/index.ts#L337
			const versionMetadata: PropVersionMetadata = {
				pluginId,
				version: 'current',
				label: 'Current',
				banner: 'none',
				isLast: true,
				docsSidebars: { api: await extractSidebar(apiPackages) },
			};
			const versionMetadataData = await createData(
				`version-${versionMetadata.version}-metadata.json`,
				JSON.stringify(versionMetadata),
			);

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

			const optionsData = await createData('options.json', JSON.stringify({ minimal, pluginId }));

			addRoute({
				path: '/api',
				exact: false,
				component: path.join(__dirname, './components/ApiPage.js'),
				routes,
				modules: {
					options: optionsData,
					packages: await createData(
						'packages.json',
						JSON.stringify(formatPackagesWithoutHostInfo(apiPackages)),
					),
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
