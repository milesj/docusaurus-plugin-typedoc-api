/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/triple-slash-reference */

/// <reference path="../node_modules/@docusaurus/plugin-content-docs/src/plugin-content-docs.d.ts" />

declare module '*.css';

declare module '@docusaurus/useDocusaurusContext' {
	import { DocusaurusContext} from '@docusaurus/types';

	export default function useDocusaurusContext(): DocusaurusContext;
}

declare module '@docusaurus/router' {
  export function matchPath(
		url: string,
		options: { path: string, exact?: boolean, strict?: boolean },
	): boolean;
}

declare module '@docusaurus/renderRoutes' {
  export default function renderRoutes(routes: unknown[]): JSX.Element;
}
