import { JSONOutput } from 'typedoc';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs-types';

export type SidebarItem = PropSidebarItem;

export interface ApiMetadata {
	id: number;
	name: string;
	slug: string;
	permalink: string;
	previousId?: number;
	nextId?: number;
}

export interface DeclarationInfo
	extends Omit<JSONOutput.DeclarationReflection, 'children'>,
		ApiMetadata {
	children?: DeclarationInfo[];
}

export interface PackageInfo extends Omit<JSONOutput.ProjectReflection, 'children'>, ApiMetadata {
	children?: DeclarationInfo[];
	packageName: string;
	packageVersion: string;
}
