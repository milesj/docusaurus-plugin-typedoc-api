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
  `packageEntryPoints` options are required.

```js
module.exports = {
	// ...
	plugins: plugins: [
		[
			'docusaurus-plugin-typedoc-api',
			{
				projectRoot: path.join(__dirname, '..'),
				packageEntryPoints: ['packages/example/src/index.ts'],
			},
		],
	],
};
```

## Configuration

The following options are available to the plugin:

- `projectRoot` (`string`) - Absolute path to the project root where `tsconfig.json` is located.
  _(Required)_
- `packageEntryPoints` (`string[]`) - List of package entry points, relative to the project root.
  _(Required)_
- `exclude` (`string[]`) - List of glob patterns to exclude unwanted packages. This is necessary
  when using TypeScript project references.
- `minimal` (`boolean`) - Render a minimal layout and reduce the amount of information displayed.
  Defaults to `false`.
- `includeReadmes` (`boolean`) - Include and render the `README.md` file from every package.
  Defaults to `false`.
