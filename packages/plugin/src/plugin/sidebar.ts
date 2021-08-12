import { JSONOutput } from 'typedoc';
import { DeclarationReflectionMap, SidebarItem } from '../types';
import { createReflectionMap } from './data';

export function groupSidebarItems(
	map: DeclarationReflectionMap,
	groups: JSONOutput.ReflectionGroup[],
): SidebarItem[] {
	const items: SidebarItem[] = [];
	const sortedGroups = groups.sort((a, b) => a.title.localeCompare(b.title));

	function getLastItemInGroup(index: number) {
		const length = sortedGroups[index]?.children?.length;

		return length ? length - 1 : undefined;
	}

	sortedGroups.forEach((group, groupIndex) => {
		const { children } = group;

		if (!children || children.length === 0) {
			return;
		}

		items.push({
			collapsed: true,
			collapsible: true,
			items: children.map((id, index) => {
				const child = map[id];

				// We map previous/next from here since the sidebar is grouped by type,
				// and we only want to link based on this order.
				const previousId = index === 0 ? getLastItemInGroup(groupIndex - 1) : children[index - 1];
				const nextId =
					index === children.length - 1
						? groups[groupIndex + 1]?.children?.[0]
						: children[index + 1];

				if (previousId) {
					child.previousId = previousId;
				}

				if (nextId) {
					child.nextId = nextId;
				}

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
