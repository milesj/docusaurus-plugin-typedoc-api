import path from 'path';
import TypeDoc from 'typedoc';

const plugin = {
	name: 'docusaurus-plugin-typedoc-api',
	async loadContent() {
		const filePath = path.join(context.generatedFilesDir, 'typedoc.json');

		if (fs.existsSync(filePath)) {
			return require(filePath);
		}

		console.log(context);
		console.log('loadContent');

		const app = new TypeDoc.Application();

		app.options.addReader(new TypeDoc.TSConfigReader());
		app.options.addReader(new TypeDoc.TypeDocReader());

		app.bootstrap({
			tsconfig: '../tsconfig.json',
			entryPoints: pkgList.map((name) => `../packages/${name}/src/index.ts`),
			exclude: ['**/themes/*', '**/website/*'],
			excludeExternals: true,
			excludePrivate: true,
		});

		const project = app.convert();

		if (project) {
			await app.generateJson(project, filePath);

			return require(filePath);
		}
	},
	async contentLoaded({ content, actions }) {
		if (!content) {
			return;
		}

		const { createData, addRoute } = actions;

		console.log('contentLoaded');

		await Promise.all(
			content.children.map(async (pkg) => {
				const { children: pkgExports, ...pkgMetadata } = pkg;

				pkgMetadata.name = pkg.name.replace('/src', '');

				const pkgData = await createData(
					`package-${pkgMetadata.name}.json`,
					JSON.stringify(pkgMetadata),
				);

				actions.addRoute({
					path: `/api/${pkgMetadata.name}`,
					component: '../src/pages/typedoc/Package.tsx',
					modules: {
						data: pkgData,
					},
					exact: true,
				});
			}),
		);
	},
};

export default plugin;
