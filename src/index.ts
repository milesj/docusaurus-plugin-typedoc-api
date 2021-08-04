/* eslint-disable sort-keys */

import fs from 'fs';
import path from 'path';
import type { JSONOutput } from 'typedoc';
import * as TypeDoc from 'typedoc';
import type { PropVersionMetadata } from '@docusaurus/plugin-content-docs-types';
import type { LoadContext, Plugin, RouteConfig } from '@docusaurus/types';
import { addMetadataToReflections, extractMetadata } from './data';
import { extractSidebar } from './sidebar';
import { DeclarationInfo, PackageInfo } from './types';

export interface DocusaurusPluginTypedocApiOptions {
	id?: string;
	exclude?: string[];
	packageEntryPoints: string[];
	projectRoot: string;
}

export default function typedocApiPlugin(
	context: LoadContext,
	{ exclude = [], packageEntryPoints, projectRoot, ...options }: DocusaurusPluginTypedocApiOptions,
): Plugin<JSONOutput.ProjectReflection> {
	const pluginId = options.id ?? 'default';

	return {
		name: 'docusaurus-plugin-typedoc-api',

		async loadContent() {
			const filePath = path.join(context.generatedFilesDir, 'typedoc.json');

			if (fs.existsSync(filePath)) {
				return import(filePath);
			}

			console.log('loadContent', context);

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

			console.log('contentLoaded');

			const { createData, addRoute } = actions;

			// Create a sidebar for all pages
			const sidebar = await extractSidebar(projectRoot, content);
			// const sidebarData = await createData(`sidebar.json`, JSON.stringify(sidebar));

			// Define version metadata for all pages. We need to use the same structure as
			// "docs" so that we can utilize the same React components.
			// https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-plugin-content-docs/src/index.ts#L337
			const versionMetadata: PropVersionMetadata = {
				pluginId,
				version: 'current',
				label: 'Current',
				banner: 'none',
				isLast: true,
				docsSidebars: { api: sidebar },
				permalinkToSidebar: {},
			};
			const versionMetadataData = await createData(
				`version-${versionMetadata.version}-metadata.json`,
				JSON.stringify(versionMetadata),
			);

			async function createReflectionRoute(
				info: DeclarationInfo | PackageInfo,
				componentName: string,
			): Promise<RouteConfig> {
				const reflection = extractMetadata(info);
				const reflectionData = await createData(
					`reflection-${reflection.id}.json`,
					JSON.stringify(reflection),
				);

				return {
					path: reflection.permalink,
					exact: true,
					component: path.join(__dirname, `./components/${componentName}.js`),
					modules: {
						content: reflectionData,
					},
					// @ts-expect-error This is required in `DocPage`
					sidebar: 'api',
				};
			}

			async function createDeclarationRoutes(pkg: PackageInfo) {
				// Map a route for every declaration in the package (the exported APIs)
				const routes = await Promise.all(
					pkg.children.map(async (decl) => createReflectionRoute(decl, 'ApiItem')),
				);

				// Map a top-level package route, otherwise `DocPage` shows a page not found
				routes.push(await createReflectionRoute(pkg, 'ApiItemIndex'));

				return routes.sort((a, b) => a.path.localeCompare(b.path));
			}

			await Promise.all(
				content.children.map(async (pkg) => {
					const pkgInfo = addMetadataToReflections(pkg);
					const pkgInfoData = await createData(
						`package-${pkgInfo.name}.json`,
						JSON.stringify(pkgInfo),
					);

					addRoute({
						path: pkgInfo.permalink,
						exact: false,
						component: path.join(__dirname, './components/ApiPage.js'),
						routes: await createDeclarationRoutes(pkgInfo),
						modules: {
							data: pkgInfoData,
							versionMetadata: versionMetadataData,
						},
					});
				}),
			);
		},
	};
}
