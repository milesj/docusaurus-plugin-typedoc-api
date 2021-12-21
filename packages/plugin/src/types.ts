import type { JSONOutput, TypeDocOptions } from 'typedoc';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import type { VersionBanner, VersionsOptions } from '@docusaurus/plugin-content-docs/lib/types';

export type { VersionBanner };

export interface DocusaurusPluginTypeDocApiOptions extends VersionsOptions {
	debug?: boolean;
	exclude?: string[];
	id?: string;
	minimal?: boolean;
	packageJsonName?: string;
	packages: (PackageConfig | string)[];
	projectRoot: string;
	readmeName?: string;
	readmes?: boolean;
	tsconfigName?: string;
	typedocOptions?: Partial<
		Pick<
			TypeDocOptions,
			| 'disableSources'
			| 'emit'
			| 'excludeExternals'
			| 'excludeInternal'
			| 'excludeNotDocumented'
			| 'excludePrivate'
			| 'excludeProtected'
			| 'excludeTags'
			| 'externalPattern'
			| 'listInvalidSymbolLinks'
			| 'logger'
			| 'logLevel'
			| 'sort'
			| 'treatWarningsAsErrors'
		>
	>;

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
	minimal: boolean;
	pluginId: string;
}

// REFLECTIONS

export interface PackageReflectionGroupEntry {
	index: boolean;
	label: string;
	reflection: JSONOutput.ProjectReflection;
	urlSlug: string;
}

export interface PackageReflectionGroup {
	entryPoints: PackageReflectionGroupEntry[];
	packageName: string;
	packageVersion: string;
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

declare module 'typedoc/dist/lib/serialization/schema' {
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
