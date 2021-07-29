import fs from 'fs';
import path from 'path';
import { JSONOutput, ReflectionKind } from 'typedoc';
import { createDeclarationMap, DeclarationReflectionMap } from './data';
import { SidebarItem } from './types';
import { createUrl, getKindSlug } from './url';

async function loadPackageJson(initialDir: string) {
	let currentDir = initialDir;

	while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
		currentDir = path.dirname(currentDir);
	}

	return JSON.parse(await fs.promises.readFile(path.join(currentDir, 'package.json'), 'utf8')) as {
		name: string;
	};
}

export function groupSidebarItems(
	pkgSlug: string,
	decls: DeclarationReflectionMap,
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
					const child = decls[id];

					return {
						href:
							child.kind === ReflectionKind.Variable
								? createUrl(pkgSlug, `#${child.name}`)
								: createUrl(pkgSlug, getKindSlug(child), child.name),
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

export async function extractSidebar(
	projectRoot: string,
	project: JSONOutput.DeclarationReflection | JSONOutput.ProjectReflection,
): Promise<SidebarItem[]> {
	const packages = (
		project.kind === ReflectionKind.Project ? project.children ?? [] : [project]
	).filter((pkg) => pkg.kind === ReflectionKind.Module) as JSONOutput.DeclarationReflection[];

	if (packages.length === 0) {
		return [];
	}

	const items: SidebarItem[] = await Promise.all(
		packages.map(async (pkg, index) => {
			const pkgInfo = await loadPackageJson(
				path.join(projectRoot, path.dirname(String(pkg.sources?.[0].fileName))),
			);
			const pkgSlug = pkg.name.replace('/src', '');
			const itemsMap = createDeclarationMap(pkg.children);

			return {
				collapsed: index > 0,
				collapsible: true,
				items: pkg.groups ? groupSidebarItems(pkgSlug, itemsMap, pkg.groups) : [],
				label: pkgInfo.name,
				type: 'category',
			} as const;
		}),
	);

	return items.filter((item) => 'items' in item && items.length > 0);
}
