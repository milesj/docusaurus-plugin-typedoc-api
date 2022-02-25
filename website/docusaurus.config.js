const path = require('path');
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

let versions = [];

try {
	versions = require('./versions.json');
} catch {}

// MONOREPO
const monorepo = {
	projectRoot: path.join(__dirname, '../fixtures/monorepo'),
	packages: [
		{
			path: 'deep-imports',
			entry: 'src/',
		},
		{
			path: 'multi-imports',
			entry: {
				index: 'src/index.ts',
				test: { path: 'src/test.ts', label: 'Test utilities' },
			},
		},
		'standard',
	],
};

// POLYREPO STANDARD
const polyrepo = {
	projectRoot: path.join(__dirname, '../fixtures/polyrepo-standard'),
	packages: ['.'],
};

// POLYREPO DEEP IMPORTS
const polyrepoDeep = {
	projectRoot: path.join(__dirname, '../fixtures/polyrepo-deep-imports'),
	packages: [
		{
			path: '.',
			entry: 'src/',
		},
	],
};

// POLYREPO MULTIPLE IMPORTS
const polyrepoMultiple = {
	projectRoot: path.join(__dirname, '../fixtures/polyrepo-multi-imports'),
	packages: [
		{
			path: '.',
			entry: {
				index: 'src/index.ts',
				test: { path: 'src/test.ts', label: 'Test utilities' },
			},
		},
	],
};

// LOCAL DEV
const local = {
	projectRoot: path.join(__dirname, '../../boost'),
	packages: [
		...[
			'args',
			'common',
			'config',
			'decorators',
			'event',
			'pipeline',
			'plugin',
			'terminal',
			'translate',
		].map((pkg) => `packages/${pkg}`),
		{
			path: 'packages/cli',
			entry: {
				index: 'src/index.ts',
				react: { path: 'src/react.ts', label: 'Components & hooks' },
				test: { path: 'src/test.ts', label: 'Test utilities' },
			},
		},
		{
			path: 'packages/debug',
			entry: {
				index: { path: 'src/index.ts', label: 'Index' },
				test: { path: 'src/test.ts', label: 'Test utilities' },
			},
		},
		{
			path: 'packages/log',
			entry: {
				index: { path: 'src/index.ts', label: 'Index' },
				test: { path: 'src/test.ts', label: 'Test utilities' },
			},
		},
		{
			path: 'packages/module',
			entry: {
				index: 'src/index.ts',
				loader: { path: 'src/loaders/index.ts', label: 'ESM Loaders' },
			},
		},
	],
};

function getPluginConfig() {
	switch (process.env.DOCS_REPO_TYPE) {
		case 'monorepo':
			return monorepo;
		case 'polyrepo':
			return polyrepo;
		case 'polyrepo-deep':
			return polyrepoDeep;
		case 'polyrepo-multi':
			return polyrepoMultiple;
		default:
			return local;
	}
}

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
	title: 'My Site',
	tagline: 'Dinosaurs are cool',
	url: 'https://your-docusaurus-test-site.com',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'throw',
	favicon: 'img/favicon.ico',
	organizationName: 'facebook', // Usually your GitHub org/user name.
	projectName: 'docusaurus', // Usually your repo name.
	themeConfig: {
		navbar: {
			title: 'My Site',
			logo: {
				alt: 'My Site Logo',
				src: 'img/logo.svg',
			},
			items: [
				{
					type: 'doc',
					docId: 'intro',
					position: 'left',
					label: 'Tutorial',
				},
				{
					type: 'docsVersionDropdown',
				},
				{
					to: 'api',
					label: 'API',
					position: 'left',
				},
				{
					type: 'dropdown',
					to: 'api',
					label: 'API',
					position: 'left',
					items:
						versions.length > 0
							? [
									{ label: 'Next', to: 'api/next' },
									...versions.map((version, i) => ({
										label: version,
										to: i === 0 ? 'api' : `api/${version}`,
									})),
							  ]
							: [],
				},
				{
					href: 'https://github.com/facebook/docusaurus',
					label: 'GitHub',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Docs',
					items: [
						{
							label: 'Tutorial',
							to: '/docs/intro',
						},
					],
				},
				{
					title: 'Community',
					items: [
						{
							label: 'Stack Overflow',
							href: 'https://stackoverflow.com/questions/tagged/docusaurus',
						},
						{
							label: 'Discord',
							href: 'https://discordapp.com/invite/docusaurus',
						},
						{
							label: 'Twitter',
							href: 'https://twitter.com/docusaurus',
						},
					],
				},
				{
					title: 'More',
					items: [
						{
							label: 'GitHub',
							href: 'https://github.com/facebook/docusaurus',
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
		},
		prism: {
			theme: lightCodeTheme,
			darkTheme: darkCodeTheme,
		},
	},
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					// Please change this to your repo.
					editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
				},
				blog: {
					showReadingTime: true,
					// Please change this to your repo.
					editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/blog/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			},
		],
	],
	plugins: [
		[
			'docusaurus-plugin-typedoc-api',
			{
				exclude: ['**/themes/*', '**/website/*'],
				minimal: false,
				readmes: false,
				...getPluginConfig(),
			},
		],
	],
};
