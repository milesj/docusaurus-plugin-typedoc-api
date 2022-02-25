// The docusaurus types provided conflict with ours, so whitelist what we need
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

declare module '@theme/hooks/useWindowSize' {
	export const windowSizes: {
		desktop: 'desktop';
		mobile: 'mobile';
		ssr: 'ssr';
	};

	export type WindowSize = keyof typeof windowSizes;

	export default function useWindowSize(): WindowSize;
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
