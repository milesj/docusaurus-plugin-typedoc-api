// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="@docusaurus/theme-classic" />

declare module '@docusaurus/Link' {
	type NavLinkProps = Partial<import('react-router-dom').NavLinkProps>;
	export type LinkProps = NavLinkProps & {
		readonly isNavLink?: boolean;
		readonly to?: string;
		readonly href?: string;
		readonly autoAddBaseUrl?: boolean;
	};
	const Link: (props: LinkProps) => JSX.Element;
	export default Link;
}

declare module '@docusaurus/useDocusaurusContext' {
	import { DocusaurusContext } from '@docusaurus/types';

	export default function useDocusaurusContext(): DocusaurusContext;
}

declare module '@docusaurus/router' {
	export function matchPath(
		url: string,
		options: { path: string; exact?: boolean; strict?: boolean },
	): boolean;
}

declare module '@docusaurus/renderRoutes' {
	export default function renderRoutes(routes: unknown[]): JSX.Element;
}

declare module '@docusaurus/plugin-content-docs/client' {
  export * from '@docusaurus/plugin-content-docs/lib/client/index';
}

declare module '@docusaurus/plugin-content-docs/server' {
  export * from '@docusaurus/plugin-content-docs/lib/server-export';
}

declare module '@docusaurus/theme-common/internal' {
	import { PropVersionMetadata } from '@docusaurus/plugin-content-docs';

	export function useDocsVersion(): PropVersionMetadata;
}

declare module '*.module.css' {
	const classes: Readonly<Record<string, string>>;
	export default classes;
}

declare module '*.css' {
	const src: string;
	export default src;
}
