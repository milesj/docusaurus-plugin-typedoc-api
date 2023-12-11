import { JSONOutput } from 'typedoc';
import { normalizeUrl } from '@docusaurus/utils';
import type {
	DocusaurusPluginTypeDocApiOptions,
	PackageReflectionGroup,
	SidebarItem,
	TSDDeclarationReflection,
	TSDDeclarationReflectionMap,
} from '../types';
import { removeScopes } from '../utils/links';
import { createReflectionMap } from './data';

export function groupSidebarItems(
	map: TSDDeclarationReflectionMap,
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

export function extractReflectionSidebar(pkg: TSDDeclarationReflection): SidebarItem[] {
	const overview = {
		href: pkg.permalink,
		label: 'Overview',
		type: 'link',
	};
	return pkg.groups
		? [overview, ...groupSidebarItems(createReflectionMap(pkg.children), pkg.groups)]
		: [];
}

export function extractSidebar(
	packages: PackageReflectionGroup[],
	scopes: string[],
	changelogs: boolean,
	sortSidebar: NonNullable<DocusaurusPluginTypeDocApiOptions['sortSidebar']>,
	packageCategories: string[],
): SidebarItem[] {
	if (packages.length === 0) {
		return [];
	}

	const categories = new Map(packageCategories.map((category) => [category, []]));
	for (const pkg of packages) {
		const subItems = [];
		if (pkg.entryPoints.length === 1) {
			subItems.push(...extractReflectionSidebar(pkg.entryPoints[0].reflection));
		} else {
			pkg.entryPoints.forEach((entry) => {
				if (entry.reflection.groups) {
					subItems.push({
						collapsed: true,
						collapsible: true,
						items: extractReflectionSidebar(entry.reflection),
						label: entry.label,
						type: 'category',
					});
				}
			});
		}

		// Always include the overview as the 1st item
		const indexHref = pkg.entryPoints.find((entry) => entry.index)?.reflection.permalink ?? '';

		if (pkg.changelogPath && changelogs) {
			subItems.push({
				href: normalizeUrl([indexHref, 'changelog']),
				label: 'Changelog',
				type: 'link',
			});
		}

		if (!categories.has(pkg.category)) {
			categories.set(pkg.category, []);
		}

		categories.get(pkg.category).push({
			collapsed: true,
			collapsible: true,
			items: subItems,
			label: removeScopes(pkg.packageName, scopes),
			type: 'category',
		});
	}

	return Array.from(categories, ([category, items]) => ({
		collapsed: false,
		collapsible: false,
		items,
		label: category,
		type: 'category',
	}));
}
