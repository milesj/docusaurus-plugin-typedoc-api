import type { JSONOutput } from 'typedoc';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs-types';

// CONFIG

export interface PackageEntryConfig {
	label: string;
	file: string;
}

export interface PackageConfig {
	path: string; // Folder relative to project root
	entry?: PackageEntryConfig | PackageEntryConfig[] | string;
}

export interface ResolvedPackageConfig {
	absolutePath: string;
	entryPoints: PackageEntryConfig[];
	packagePath: string;
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
