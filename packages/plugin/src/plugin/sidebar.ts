import { JSONOutput } from 'typedoc';
import { DeclarationReflectionMap, PackageReflectionGroup, SidebarItem } from '../types';
import { createReflectionMap } from './data';

export function groupSidebarItems(
	map: DeclarationReflectionMap,
	groups: JSONOutput.ReflectionGroup[],
): SidebarItem[] {
	const items: SidebarItem[] = [];
	const sortedGroups = groups.sort((a, b) => a.title.localeCompare(b.title));

	function getLastItemInGroup(index: number) {
		const length = sortedGroups[index]?.children?.length;

		return length ? sortedGroups[index]?.children?.[length - 1] : undefined;
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

export function extractReflectionSidebar(pkg: JSONOutput.ProjectReflection): SidebarItem[] {
	return pkg.groups ? groupSidebarItems(createReflectionMap(pkg.children), pkg.groups) : [];
}

export function extractSidebar(packages: PackageReflectionGroup[]): SidebarItem[] {
	if (packages.length === 0) {
		return [];
	}

	const items: SidebarItem[] = packages.map((pkg) => {
		const subItems: SidebarItem[] = [];

		pkg.entryPoints.forEach((entry) => {
			// Index entry point should always bubble up reflection groups
			if (entry.index) {
				subItems.push(...extractReflectionSidebar(entry.reflection));
				// Otherwise nest non-index entry points behind categories
			} else {
				subItems.push({
					collapsed: true,
					collapsible: true,
					items: extractReflectionSidebar(entry.reflection),
					label: entry.label,
					type: 'category',
				});
			}
		});

		// Always include the overview as the 1st item
		subItems.unshift({
			href: pkg.entryPoints.find((entry) => entry.index)?.reflection.permalink ?? '',
			label: 'Overview',
			type: 'link',
		});

		return {
			collapsed: true,
			collapsible: true,
			items: subItems,
			label: pkg.packageName,
			type: 'category',
		} as const;
	});

	const sidebar = items.filter((item) => 'items' in item && items.length > 0);

	// Collapse sidebar when only 1 package
	if (packages.length === 1 && sidebar.length === 1 && sidebar[0].type === 'category') {
		return sidebar[0].items;
	}

	return sidebar;
}
