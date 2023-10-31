import type { DeclarationReflection, JSONOutput, TypeDocOptions } from 'typedoc';
import type {
	PropSidebarItem,
	VersionBanner,
	VersionsOptions,
} from '@docusaurus/plugin-content-docs';

export type { VersionBanner };

export interface DocusaurusPluginTypeDocApiOptions
	extends Omit<VersionsOptions, 'disableVersioning' | 'includeCurrentVersion'> {
	banner?: string;
	breadcrumbs?: boolean;
	changelogName?: string;
	changelogs?: boolean;
	gitRefName?: string;
	debug?: boolean;
	exclude?: string[];
	id?: string;
	minimal?: boolean;
	packageJsonName?: string;
	packages: (PackageConfig | string)[];
	projectRoot: string;
	readmeName?: string;
	readmes?: boolean;
	removeScopes?: string[];
	sortPackages?: (a: PackageReflectionGroup, d: PackageReflectionGroup) => number;
	sortSidebar?: (a: string, d: string) => number;
	tsconfigName?: string;
	typedocOptions?: Partial<TypeDocOptions>;

	// Versioning, based on Docusaurus
	disableVersioning?: boolean;
	includeCurrentVersion?: boolean;
	routeBasePath?: string;
}

// CONFIG

export interface PackageEntryConfig {
	label: string;
	path: string;
}

export interface PackageConfig {
	path: string; // Folder relative to project root
	entry?: Record<string, PackageEntryConfig | string> | string;
	slug?: string;
}

export interface ResolvedPackageConfig {
	entryPoints: Record<string, PackageEntryConfig>;
	packagePath: string;
	packageSlug: string;
	packageName: string;
	packageVersion: string;
}

// VERSIONING

export interface VersionMetadata {
	versionName: string; // 1.0.0
	versionLabel: string; // Version 1.0.0
	versionPath: string; // /baseUrl/api/1.0.0
	versionBadge: boolean;
	versionBanner: VersionBanner | null;
	versionClassName: string;
	isLast: boolean;
	routePriority: number | undefined; // -1 for the latest
}

export interface LoadedVersion extends VersionMetadata {
	// mainDocId: string;
	packages: PackageReflectionGroup[];
	sidebars: SidebarItem[];
}

export interface LoadedContent {
	loadedVersions: LoadedVersion[];
}

// SIDEBAR / UI

export type SidebarItem = PropSidebarItem;

export interface ApiOptions {
	banner: string;
	breadcrumbs: boolean;
	gitRefName: string;
	minimal: boolean;
	pluginId: string;
	scopes: string[];
}

export interface TOCItem {
	readonly value: string;
	readonly id: string;
	readonly level: number;
}

// REFLECTIONS

export interface PackageReflectionGroupEntry {
	index: boolean;
	label: string;
	reflection: JSONOutput.DeclarationReflection;
	urlSlug: string;
}

export interface PackageReflectionGroup {
	entryPoints: PackageReflectionGroupEntry[];
	packageName: string;
	packageVersion: string;
	changelogPath?: string;
	readmePath?: string;
}

export interface ApiMetadata {
	id: number;
	name: string;
	permalink: string;
	previousId?: number;
	nextId?: number;
}

export type DeclarationReflectionMap = Record<number, JSONOutput.DeclarationReflection>;

declare module 'typedoc' {
	interface Reflection extends ApiMetadata {
		// Not typed but used in the templates
		declaration?: DeclarationReflection;
		// Added by us for convenience
		parentId?: number;
	}

	interface Type {
		// Not typed but used in the templates
		declaration?: DeclarationReflection;
	}
}

declare global {
	// eslint-disable-next-line no-var, vars-on-top
	var typedocBuild: { count: number };
}
