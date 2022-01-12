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
		options: { path: string; exact?: boolean; strict?: boolean },
	): boolean;
}

declare module '@docusaurus/renderRoutes' {
	export default function renderRoutes(routes: unknown[]): JSX.Element;
}

declare module '@theme/Layout' {
	import type { ReactNode } from 'react';

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

declare module '@theme/Heading' {
	export type HeadingType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
	export interface Props extends ComponentProps<HeadingType> {}

	const Heading: (Tag: HeadingType) => (props: Props) => JSX.Element;
	export default Heading;
	export const MainHeading: (props: Props) => JSX.Element;
}

declare module '@theme/hooks/useWindowSize' {
	export const windowSizes: {
		desktop: 'desktop';
		mobile: 'mobile';
		ssr: 'ssr';
	};

	export type WindowSize = keyof typeof windowSizes;

	export default function useWindowSize(): WindowSize;
}

declare module '@theme/MDXComponents' {
	import type CodeBlock from '@theme/CodeBlock';
	import type Head from '@docusaurus/Head';

	export interface MDXComponentsObject {
		readonly head: typeof Head;
		readonly code: typeof CodeBlock;
		readonly a: (props: ComponentProps<'a'>) => JSX.Element;
		readonly pre: typeof CodeBlock;
		readonly details: (props: ComponentProps<'details'>) => JSX.Element;
		readonly h1: (props: ComponentProps<'h1'>) => JSX.Element;
		readonly h2: (props: ComponentProps<'h2'>) => JSX.Element;
		readonly h3: (props: ComponentProps<'h3'>) => JSX.Element;
		readonly h4: (props: ComponentProps<'h4'>) => JSX.Element;
		readonly h5: (props: ComponentProps<'h5'>) => JSX.Element;
		readonly h6: (props: ComponentProps<'h6'>) => JSX.Element;
	}

	const MDXComponents: MDXComponentsObject;
	export default MDXComponents;
}

declare module '@theme/TOCItems' {
	import type { TOCItem, TOCItem, TOCItem, TOCItem } from '@docusaurus/types';

	export interface TOCItemsProps {
		readonly toc: readonly TOCItem[];
		readonly minHeadingLevel?: number;
		readonly maxHeadingLevel?: number;
		readonly className?: string;
		readonly linkClassName?: string | null;
		readonly linkActiveClassName?: string;
	}

	export default function TOCItems(props: TOCItemsProps): JSX.Element;
}

declare module '@theme/TOC' {
	// minHeadingLevel only exists as a per-doc option,
	// and won't have a default set by Joi. See TOC, TOCInline,
	// TOCCollapsible for examples
	export interface TOCProps {
		readonly toc: readonly TOCItem[];
		readonly minHeadingLevel?: number;
		readonly maxHeadingLevel?: number;
		readonly className?: string;
	}

	export interface TOCHeadingsProps {
		readonly toc: readonly TOCItem[];
		readonly minHeadingLevel?: number;
		readonly maxHeadingLevel?: number;
	}

	export const TOCHeadings: (props: TOCHeadingsProps) => JSX.Element;

	const TOC: (props: TOCProps) => JSX.Element;
	export default TOC;
}

declare module '@theme/TOCInline' {
	export interface TOCInlineProps {
		readonly toc: readonly TOCItem[];
		readonly minHeadingLevel?: number;
		readonly maxHeadingLevel?: number;
	}

	const TOCInline: (props: TOCInlineProps) => JSX.Element;
	export default TOCInline;
}

declare module '@theme/TOCCollapsible' {
	export interface TOCCollapsibleProps {
		readonly className?: string;
		readonly minHeadingLevel?: number;
		readonly maxHeadingLevel?: number;
		readonly toc: readonly TOCItem[];
	}

	const TOCCollapsible: (props: TOCCollapsibleProps) => JSX.Element;
	export default TOCCollapsible;
}

declare module '@theme/DocPaginator' {
	interface PageInfo {
		readonly permalink: string;
		readonly title: string;
	}

	export interface Props {
		readonly metadata: { readonly previous?: PageInfo; readonly next?: PageInfo };
	}

	const DocPaginator: (props: Props) => JSX.Element;
	export default DocPaginator;
}

declare module '@docusaurus/plugin-content-docs/client' {
  export interface ActivePlugin {
    pluginId: string;
    pluginData: GlobalPluginData;
  }
  export interface ActiveDocContext {
    activeVersion?: GlobalVersion;
    activeDoc?: GlobalDoc;
    alternateDocVersions: Record<string, GlobalDoc>;
  }
  export interface GlobalDoc {
    id: string;
    path: string;
    sidebar: string | undefined;
  }

  export interface GlobalVersion {
    name: string;
    label: string;
    isLast: boolean;
    path: string;
    mainDocId: string; // home doc (if docs homepage configured), or first doc
    docs: GlobalDoc[];
    sidebars?: Record<string, GlobalSidebar>;
  }

  export interface GlobalSidebarLink {
    label: string;
    path: string;
  }

  export interface GlobalSidebar {
    link?: GlobalSidebarLink;
    // ... we may add other things here later
  }
  export interface GlobalPluginData {
    path: string;
    versions: GlobalVersion[];
  }
  export interface DocVersionSuggestions {
    // suggest the latest version
    latestVersionSuggestion: GlobalVersion;
    // suggest the same doc, in latest version (if exist)
    latestDocSuggestion?: GlobalDoc;
  }
  export interface GetActivePluginOptions {failfast?: boolean} // use fail-fast option if you know for sure one plugin instance is active

  export const useAllDocsData: () => Record<string, GlobalPluginData>;
  export const useDocsData: (pluginId?: string) => GlobalPluginData;
  export const useActivePlugin: (
    options?: GetActivePluginOptions,
  ) => ActivePlugin | undefined;
  export const useActivePluginAndVersion: (
    options?: GetActivePluginOptions,
  ) =>
    | {activePlugin: ActivePlugin; activeVersion: GlobalVersion | undefined}
    | undefined;
  export const useVersions: (pluginId?: string) => GlobalVersion[];
  export const useLatestVersion: (pluginId?: string) => GlobalVersion;
  export const useActiveVersion: (
    pluginId?: string,
  ) => GlobalVersion | undefined;
  export const useActiveDocContext: (pluginId?: string) => ActiveDocContext;
  export const useDocVersionSuggestions: (
    pluginId?: string,
  ) => DocVersionSuggestions;
}

declare module '*.module.css' {
	const classes: Readonly<Record<string, string>>;
	export default classes;
}

declare module '*.css' {
	const src: string;
	export default src;
}
