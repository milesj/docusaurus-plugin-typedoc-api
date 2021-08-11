import { JSONOutput } from 'typedoc';
import { DeclarationReflectionMap, SidebarItem } from '../types';
import { createReflectionMap } from './data';

export function groupSidebarItems(
	map: DeclarationReflectionMap,
	groups: JSONOutput.ReflectionGroup[],
): SidebarItem[] {
	const items: SidebarItem[] = [];

	groups
		.sort((a, b) => a.title.localeCompare(b.title))
		.forEach((group, index) => {
			if (!group.children || group.children.length === 0) {
				return;
			}

			items.push({
				collapsed: index > 0,
				collapsible: true,
				items: group.children.map((id) => {
					const child = map[id];

					return {
						href: child.permalink,
						label: child.name,
						type: 'link',
					};
				}),
				label: group.title,
				type: 'category',
			});
		});

	return items;
}

export function extractSidebar(packages: JSONOutput.ProjectReflection[]): SidebarItem[] {
	if (packages.length === 0) {
		return [];
	}

	const items: SidebarItem[] = packages.map((pkg, index) => {
		const itemsMap = createReflectionMap(pkg.children);
		const subItems = pkg.groups ? groupSidebarItems(itemsMap, pkg.groups) : [];

		subItems.unshift({
			href: pkg.permalink,
			label: 'Overview',
			type: 'link',
		});

		return {
			collapsed: index > 0,
			collapsible: true,
			items: subItems,
			label: pkg.packageName,
			type: 'category',
		} as const;
	});

	return items.filter((item) => 'items' in item && items.length > 0);
}

export function extractSidebarPermalinks(
	packages: JSONOutput.ProjectReflection[],
): Record<string, string> {
	const map: Record<string, string> = {};

	if (packages.length === 0) {
		return map;
	}

	packages.forEach((pkg) => {
		map[pkg.permalink] = 'api';

		pkg.children?.forEach((child) => {
			map[child.permalink] = 'api';
		});
	});

	return map;
}
