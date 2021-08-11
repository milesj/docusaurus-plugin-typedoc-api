/* eslint-disable sort-keys */

import fs from 'fs';
import path from 'path';
import type { JSONOutput } from 'typedoc';
import * as TypeDoc from 'typedoc';
import type { PropVersionMetadata } from '@docusaurus/plugin-content-docs-types';
import type { LoadContext, Plugin, RouteConfig } from '@docusaurus/types';
import { addMetadataToPackages, extractMetadata } from './plugin/data';
import { extractSidebar, extractSidebarPermalinks } from './plugin/sidebar';

export interface DocusaurusPluginTypedocApiOptions {
	exclude?: string[];
	id?: string;
	includeReadmes?: boolean;
	packageEntryPoints: string[];
	projectRoot: string;
}

export default function typedocApiPlugin(
	context: LoadContext,
	{
		exclude = [],
		includeReadmes,
		packageEntryPoints,
		projectRoot,
		...options
	}: DocusaurusPluginTypedocApiOptions,
): Plugin<JSONOutput.ProjectReflection> {
	const pluginId = options.id ?? 'default';

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
				entryPoints: packageEntryPoints.map((entry) => path.join(projectRoot, entry)),
				exclude,
				excludeExternals: true,
				excludeInternal: true,
				excludePrivate: true,
				excludeProtected: true,
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
			const apiPackages = await addMetadataToPackages(projectRoot, content);

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
				// @ts-expect-error Old versions
				permalinkToSidebar: await extractSidebarPermalinks(apiPackages),
			};
			const versionMetadataData = await createData(
				`version-${versionMetadata.version}-metadata.json`,
				JSON.stringify(versionMetadata),
			);

			async function createRoute(info: JSONOutput.Reflection): Promise<RouteConfig> {
				const reflection = extractMetadata(info);
				const reflectionData = await createData(
					`reflection-${reflection.id}.json`,
					JSON.stringify(reflection),
				);
				const modules = {
					content: reflectionData,
				};

				if (includeReadmes && 'readmePath' in info) {
					Object.assign(modules, {
						readme: (info as JSONOutput.ProjectReflection).readmePath,
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

			async function createDeclarationRoutes(pkg: JSONOutput.ProjectReflection) {
				// Map a route for every declaration in the package (the exported APIs)
				const routes = await Promise.all(
					pkg.children ? pkg.children.map(async (decl) => createRoute(decl)) : [],
				);

				// Map a top-level package route, otherwise `DocPage` shows a page not found
				routes.push(await createRoute(pkg));

				return routes.sort((a, b) => a.path.localeCompare(b.path));
			}

			await Promise.all(
				apiPackages.map(async (pkg) => {
					const pkgData = await createData(`package-${pkg.name}.json`, JSON.stringify(pkg));

					addRoute({
						path: pkg.permalink,
						exact: false,
						component: path.join(__dirname, './components/ApiPage.js'),
						routes: await createDeclarationRoutes(pkg),
						modules: {
							data: pkgData,
							versionMetadata: versionMetadataData,
						},
					});
				}),
			);
		},

		configureWebpack(config, isServer, utils) {
			if (!includeReadmes) {
				return {};
			}

			return {
				module: {
					rules: [
						{
							test: /\.mdx?$/,
							include: `${projectRoot}/`,
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
							],
						},
					],
				},
			};
		},
	};
}
