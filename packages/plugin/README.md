# docusaurus-plugin-typedoc-api

[![Build Status](https://travis-ci.org/milesj/docusaurus-plugin-typedoc-api.svg?branch=master)](https://travis-ci.org/milesj/docusaurus-plugin-typedoc-api)
[![npm version](https://badge.fury.io/js/docusaurus-plugin-typedoc-api.svg)](https://www.npmjs.com/package/docusaurus-plugin-typedoc-api)
[![npm deps](https://david-dm.org/milesj/docusaurus-plugin-typedoc-api.svg?path=packages/plugin)](https://www.npmjs.com/package/docusaurus-plugin-typedoc-api)

A Docusaurus plugin for generating source code `/api/*` routes, powered by
[TypeDoc](https://typedoc.org/).

The plugin has been designed to _only_ document your public API (anything exported from a package's
entry point), so any private, protected, or internal code will not be generated.

## Requirements

- TypeScript >= v4
- `@docusaurus/core` >= v2.0.0-beta.4
- `@docusaurus/preset-classic` >= v2.0.0-beta.4

## Examples

- [Boost](https://github.com/milesj/boost) - https://boostlib.dev/api

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

- Update `onBrokenLinks` to _not_ error or throw. There's an issue with
  [custom routes not working properly with broken link detection](https://github.com/facebook/docusaurus/issues/5374).

```js
module.exports = {
	// ...
	onBrokenLinks: 'warn',
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

We can also support multiple entry points by passing a map of objects to `entry`, where each key is
a sub-path that can be imported from the package (excluding the `index`). Each entry object requires
a `path` and a `label`, which is used for categorizing and sidebars.

```js
module.exports = {
	packages: [
		'packages/core',
		{
			path: 'packages/react',
			entry: {
				index: 'src/index.tsx',
				client: { file: 'src/client.tsx', label: 'Client' },
				server: { file: 'src/server.tsx', label: 'Server' },
				'server/test': { file: 'src/server/test-utils.tsx', label: 'Server test utils' },
			},
		},
	],
};
```

> Index entry points don't require a label, so a file path can be passed directly.
