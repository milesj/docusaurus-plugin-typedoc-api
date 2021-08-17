# docusaurus-plugin-typedoc-api

[![Build Status](https://travis-ci.org/milesj/docusaurus-plugin-typedoc-api.svg?branch=master)](https://travis-ci.org/milesj/docusaurus-plugin-typedoc-api)
[![npm version](https://badge.fury.io/js/docusaurus-plugin-typedoc-api.svg)](https://www.npmjs.com/package/docusaurus-plugin-typedoc-api)
[![npm deps](https://david-dm.org/milesj/docusaurus-plugin-typedoc-api.svg?path=packages/plugin)](https://www.npmjs.com/package/docusaurus-plugin-typedoc-api)

A Docusaurus plugin for generating source code `/api/*` routes, powered by
[TypeDoc](https://typedoc.org/).

The plugin has been designed to _only_ document your public API (anything exported from a package's
entry point), so any private, protected, or internal code will not be generated.

## Requirements

- `@docusaurus/core` >= 2.0.0-beta.4
- `@docusaurus/preset-classic` >= 2.0.0-beta.4

## Installation

```
yarn add --dev docusaurus-plugin-typedoc-api
```

Open your `docusaurus.config.js` and make the following changes:

- Add a link to the API route under `themeConfig.navbar.items` and `themeConfig.footer.links` (if
  you wish).

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

- Add the plugin to your `plugins` list in your `docusaurus.config.js`. The `projectRoot` and
  `packages` options are required.

```js
module.exports = {
	// ...
	plugins: plugins: [
		[
			'docusaurus-plugin-typedoc-api',
			{
				projectRoot: path.join(__dirname, '..'),
				packages: ['packages/example', 'packages/other'],
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
- `readmes` (`boolean`) - Include and render the `README.md` file from every package. Defaults to
  `false`.

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
relative to the package folder.

```js
module.exports = {
	packages: [
		'packages/core',
		{
			path: 'packages/react',
			entry: 'src/index.tsx',
		},
	],
};
```

We can also support multiple entry points by passing an array of objects to `entry`. Each entry
object requires a `file` path and a `label`, which is used for categorizing and sidebars.

```js
module.exports = {
	packages: [
		'packages/core',
		{
			path: 'packages/react',
			entry: [
				{ file: 'src/index.tsx', label: 'Index' },
				{ file: 'src/client.tsx', label: 'Client' },
				{ file: 'src/server.tsx', label: 'Server' },
			],
		},
	],
};
```
