# docusaurus-plugin-typedoc-api

[![Build Status](https://travis-ci.org/milesj/docusaurus-plugin-typedoc-api.svg?branch=master)](https://travis-ci.org/milesj/docusaurus-plugin-typedoc-api)
[![npm version](https://badge.fury.io/js/docusaurus-plugin-typedoc-api.svg)](https://www.npmjs.com/package/docusaurus-plugin-typedoc-api)
[![npm deps](https://david-dm.org/milesj/docusaurus-plugin-typedoc-api.svg?path=packages/plugin)](https://www.npmjs.com/package/docusaurus-plugin-typedoc-api)

A Docusaurus plugin for generating source code `/api/*` routes, powered by
[TypeDoc](https://typedoc.org/).

The plugin has been designed to document your public API by default (anything exported from a
package's entry point), so any private, protected, or internal code will not be generated.

## Requirements

- `typescript` >= v4
- `@docusaurus/core` >= v2.0.0-beta.16
- `@docusaurus/preset-classic` >= v2.0.0-beta.16

## Examples

- [Boost](https://github.com/milesj/boost) - https://boostlib.dev/api

## Installation

```
yarn add --dev docusaurus-plugin-typedoc-api
```

Open your `docusaurus.config.js` and make the following changes:

- Add a link to the API route under `themeConfig.navbar.items` and `themeConfig.footer.links` (if
  desired).

```js
module.exports = {
	// ...
	themeConfig: {
		// ...
		navbar: {
			// ...
			items: [
				// ...
				{
					to: 'api',
					label: 'API',
					position: 'left',
				},
			],
		},
	},
};
```

- Configure the plugin in your `plugins` list. The `projectRoot` and `packages` options are
  required.

```js
module.exports = {
	// ...
	plugins: [
		[
			'docusaurus-plugin-typedoc-api',
			{
				projectRoot: path.join(__dirname, '..'),
				// Monorepo
				packages: ['packages/example', 'packages/other'],
				// Polyrepo
				packages: ['.'],
			},
		],
	],
};
```

## Configuration

The following options are available to the plugin:

- `projectRoot` (`string`) - Absolute path to the project root where `tsconfig.json` is located.
  _(Required)_
- `packages` (`(string | PackageConfig)[]`) - List of packages relative to the project root.
  _(Required)_
- `exclude` (`string[]`) - List of glob patterns to exclude unwanted packages. This is necessary
  when using TypeScript project references.
- `minimal` (`boolean`) - Render a minimal layout and reduce the amount of information displayed.
  Defaults to `false`.
- `packageJsonName` (`string`) - Name of the `package.json file`. Defaults to `package.json`.
- `readmeName` (`string`) - Name of the readme file within a package. Defaults to `README.md`.
- `readmes` (`boolean`) - Include and render the readme file from every package. Defaults to
  `false`.
- `tsconfigName` (`string`) - Name of the TypeScript config file in the project root. Defaults to
  `tsconfig.json`.
- `typedocOptions` (`object`) - [TypeDoc options](https://typedoc.org/guides/options/#input-options)
  to pass to the compiler. Only supports a small subset of options, primarily around visibility
  exclusion.

### Packages

The `packages` option has been designed to support multiple packages, with multiple entry points per
package. By default the option accepts a list of strings, where each value is a relative path to a
package folder, and a default entry point of `src/index.ts`.

```js
module.exports = {
	packages: ['packages/core', 'packages/react'],
};
```

However, an object can be provided to customize the entry point. All entry point file paths are
relative to the package folder, and support 2 formats:

- **Index imports** - Consumers can only import from the package index. This is typically an entry
  point like `src/index.ts`.
- **Deep imports** - Consumers can import anything from the package using its file path. Glob the
  entire package by only passing the folder name like `src/`. _(This is useful for component
  libraries)_

```js
module.exports = {
	packages: [
		'packages/core',
		{
			path: 'packages/react',
			// Index only imports allowed
			// import {} from 'package'
			entry: 'src/index.tsx',
			// Deep imports allowed
			// import {} from 'package/some/nested/file'
			entry: 'src/',
		},
	],
};
```

When _not_ using deep imports, multiple entry points can be defined by passing a map of objects to
`entry`, where each key is a sub-path that can be imported from the package (excluding the `index`).
Each entry object requires a `path` and a `label`, which is used for categorizing and sidebars.

```js
module.exports = {
	packages: [
		'packages/core',
		{
			path: 'packages/react',
			entry: {
				// import {} from 'package'
				index: 'src/index.tsx',
				// import {} from 'package/client'
				client: { file: 'src/client.tsx', label: 'Client' },
				// import {} from 'package/server'
				server: { file: 'src/server.tsx', label: 'Server' },
				// import {} from 'package/server/test'
				'server/test': { file: 'src/server/test-utils.tsx', label: 'Server test utils' },
			},
		},
	],
};
```

> Index entry points don't require a label, so a file path can be passed directly.

## Versioning

This plugin supports API versioning by piggy-backing off the built-in
[docs versioning implementation](https://docusaurus.io/docs/versioning), which is a _requirement_
for this to work correctly.

To begin, version your docs with the built-in command:

```shell
yarn docusaurus docs:version 1.2.3
```

Once the markdown files are generated, run our versioning command _with the same version used
previously_:

```shell
yarn docusaurus api:version 1.2.3
```

This will create multiple JSON files in the `versioned_docs/version-1.2.3` directory. Be sure to
commit these files to your repo.

> When versioning, the current state of your branch will be used as that version's API. To
> update/regenerate old versions, you'll need to checkout an old commit, re-version, and copy the
> generated files to the latest branch.

### Navigation

Our API is unable to use the
[`docsVersionDropdown`](https://docusaurus.io/docs/api/themes/configuration#navbar-docs-version-dropdown)
navigation type, as it's hardcoded in Docusaurus core. However, you can create a custom version
dropdown like so:

```js
const versions = require('./versions.json');

module.exports = {
	// ...
	themeConfig: {
		// ...
		navbar: {
			// ...
			items: [
				// ...
				{
					type: 'dropdown',
					to: 'api',
					label: 'API',
					position: 'left',
					items: [
						{ label: 'Next', to: 'api/next' },
						...versions.map((version, i) => ({
							label: version,
							to: i === 0 ? 'api' : `api/${version}`,
						})),
					],
				},
			],
		},
	},
};
```

> This workaround isn't perfect and may be buggy. Use at your own risk!

### Caveats

- Each version in `versioned_docs` (or `versions.json`) _must_ contain the generated API JSON files,
  otherwise the build will fail.
- The header/footer API links are _not_ version aware, as their values are static.
- We suggest only versioning major versions, as the size of these JSON files and the webpack build
  will get very large very fast.
