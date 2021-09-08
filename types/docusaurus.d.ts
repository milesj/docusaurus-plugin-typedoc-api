// The docusaurus types provided conflict with ours, so whitelist what we need

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
		options: { path: string, exact?: boolean, strict?: boolean },
	): boolean;
}

declare module '@docusaurus/renderRoutes' {
  export default function renderRoutes(routes: unknown[]): JSX.Element;
}

declare module '@theme/Layout' {
  import type {ReactNode} from 'react';

  export interface Props {
    children: ReactNode;
    title?: string;
    noFooter?: boolean;
    description?: string;
    image?: string;
    keywords?: string[] | string;
    permalink?: string;
    wrapperClassName?: string;
    pageClassName?: string;
    searchMetadatas?: {
      version?: string;
      tag?: string;
    };
  }

  const Layout: (props: Props) => JSX.Element;
  export default Layout;
}

declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

declare module '*.css' {
  const src: string;
  export default src;
}
