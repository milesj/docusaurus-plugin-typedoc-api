import type { JSONOutput } from 'typedoc';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs-types';

export type SidebarItem = PropSidebarItem;

export interface ApiMetadata {
	id: number;
	name: string;
	slug?: string;
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

	interface ProjectReflection extends ApiMetadata {
		packageName: string;
		packageVersion: string;
		readmePath?: string;
	}

	interface Type {
		// Not typed but used in the templates
		declaration?: DeclarationReflection;
	}
}
