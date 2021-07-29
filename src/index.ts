/* eslint-disable sort-keys */

import fs from 'fs';
import path from 'path';
import type { JSONOutput } from 'typedoc';
import * as TypeDoc from 'typedoc';
import type { LoadContext, Plugin } from '@docusaurus/types';
import { extractSidebar } from './sidebar';

export interface DocusaurusPluginTypedocApiOptions {
	exclude?: string[];
	packageEntryPoints: string[];
	projectRoot: string;
}

export default function typedocApiPlugin(
	context: LoadContext,
	{ exclude = [], packageEntryPoints, projectRoot }: DocusaurusPluginTypedocApiOptions,
): Plugin<JSONOutput.ProjectReflection> {
	return {
		name: 'docusaurus-plugin-typedoc-api',
		async loadContent() {
			const filePath = path.join(context.generatedFilesDir, 'typedoc.json');

			if (fs.existsSync(filePath)) {
				// return import(filePath);
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
			const sidebarData = await createData(`sidebar.json`, JSON.stringify(sidebar));

			await Promise.all(
				content.children.map(async (pkg) => {
					const { children: pkgExports, ...pkgMetadata } = pkg;

					pkgMetadata.name = pkg.name.replace('/src', '');

					const pkgData = await createData(
						`package-${pkgMetadata.name}.json`,
						JSON.stringify(pkgMetadata),
					);

					addRoute({
						path: `/api/${pkgMetadata.name}`,
						component: path.join(__dirname, './components/ApiPage.js'),
						modules: {
							data: pkgData,
							sidebar: sidebarData,
						},
						exact: true,
					});
				}),
			);
		},
	};
}
