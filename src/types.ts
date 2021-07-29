import type { PropSidebarItem } from '@docusaurus/plugin-content-docs-types';

export type SidebarItem = PropSidebarItem;

export interface ApiRoute {
	component: () => JSX.Element;
	exact: boolean;
	path: string;
}
