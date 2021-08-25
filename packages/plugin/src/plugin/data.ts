import fs from 'fs';
import path from 'path';
import { JSONOutput, ReflectionKind } from 'typedoc';
import {
	ApiMetadata,
	DeclarationReflectionMap,
	PackageReflectionGroup,
	ResolvedPackageConfig,
} from '../types';
import { getKindSlug, getPackageSlug } from './url';

export function createReflectionMap(
	items: JSONOutput.DeclarationReflection[] = [],
): DeclarationReflectionMap {
	const map: DeclarationReflectionMap = {};

	items.forEach((item) => {
		map[item.id] = item;
	});

	return map;
}

function loadPackageJsonAndReadme(initialDir: string) {
	let currentDir = initialDir;

	while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
		currentDir = path.dirname(currentDir);
	}

	const readmePath = path.join(currentDir, 'README.md');

	return {
		packageJson: JSON.parse(fs.readFileSync(path.join(currentDir, 'package.json'), 'utf8')) as {
			name: string;
			version: string;
		},
		readmePath: fs.existsSync(readmePath) ? readmePath : '',
	};
}

export function addMetadataToReflections(
	project: JSONOutput.ProjectReflection,
	packageSlug: string,
): JSONOutput.ProjectReflection {
	const permalink = `/api/${packageSlug}`;
	const children: JSONOutput.DeclarationReflection[] = [];

	if (project.children) {
		project.children.forEach((child) => {
			const kindSlugPart = getKindSlug(child);
			const childSlug = kindSlugPart ? `/${kindSlugPart}/${child.name}` : `#${child.name}`;
			const childPermalink = permalink + childSlug;

			children.push({
				...child,
				permalink: childPermalink,
			});
		});
	}

	return {
		...project,
		children,
		permalink,
	};
}

function mergeReflections(base: JSONOutput.ProjectReflection, next: JSONOutput.ProjectReflection) {
	if (Array.isArray(base.children) && Array.isArray(next.children)) {
		base.children.push(...next.children);
	}

	if (Array.isArray(base.groups) && Array.isArray(next.groups)) {
		next.groups.forEach((group) => {
			const baseGroup = base.groups?.find((g) => g.title === group.title);

			if (baseGroup) {
				baseGroup.children?.push(...(group.children ?? []));
			} else {
				base.groups?.push(group);
			}
		});

		// We can remove refs since were merging all reflections into one
		// eslint-disable-next-line no-param-reassign
		base.groups = base.groups.filter((group) => group.title !== 'References');
	}
}

function sortReflectionGroups(reflections: JSONOutput.ProjectReflection[]) {
	reflections.forEach((reflection) => {
		const map = createReflectionMap(reflection.children);
		const sort = (a: number, b: number) => (map[a].name < map[b].name ? -1 : 1);

		reflection.categories?.forEach((category) => {
			category.children?.sort(sort);
		});

		reflection.groups?.forEach((group) => {
			group.children?.sort(sort);

			group.categories?.forEach((category) => {
				category.children?.sort(sort);
			});
		});
	});
}

export function flattenAndGroupPackages(
	packageConfigs: ResolvedPackageConfig[],
	project: JSONOutput.ProjectReflection,
): PackageReflectionGroup[] {
	const modules = (
		(project.kind === ReflectionKind.Project
			? project.children ?? []
			: [project]) as JSONOutput.ProjectReflection[]
	).filter((pkg) => pkg.kind === ReflectionKind.Module);

	// Loop through every TypeDoc module and group based on package and entry point
	const packages: Record<string, PackageReflectionGroup> = {};
	const packagesWithDeepImports: JSONOutput.ProjectReflection[] = [];

	modules.forEach((mod) => {
		const relEntrySourceFile = mod.sources?.[0]?.fileName;

		packageConfigs.some((cfg) =>
			Object.entries(cfg.entryPoints).some(([importPath, entry]) => {
				const relEntryPoint = path.join(cfg.packagePath, entry.path);
				const isUsingDeepImports = !entry.path.match(/\.tsx?$/);

				if (
					(!isUsingDeepImports && relEntrySourceFile !== relEntryPoint) ||
					(isUsingDeepImports && !relEntrySourceFile?.startsWith(relEntryPoint))
				) {
					return false;
				}

				// We have a matching entry point, so store the record
				if (!packages[cfg.packagePath]) {
					const { packageJson, readmePath } = loadPackageJsonAndReadme(cfg.absolutePath);

					packages[cfg.packagePath] = {
						entryPoints: [],
						packageName: packageJson.name,
						packageVersion: packageJson.version,
						readmePath,
					};
				}

				// Add metadata to package and children reflections
				const urlSlug = getPackageSlug(cfg.packagePath, importPath);
				const reflection = addMetadataToReflections(mod, urlSlug);
				const existingEntry = packages[cfg.packagePath].entryPoints.find(
					(ep) => ep.urlSlug === urlSlug,
				);

				if (existingEntry) {
					if (isUsingDeepImports) {
						mergeReflections(existingEntry.reflection, reflection);
					} else {
						// eslint-disable-next-line no-console
						console.error(`Entry point ${urlSlug} already defined. How did you get here?`);
					}
				} else {
					packages[cfg.packagePath].entryPoints.push({
						index: importPath === 'index',
						label: entry.label,
						reflection,
						urlSlug,
					});

					if (isUsingDeepImports) {
						packagesWithDeepImports.push(reflection);
					}
				}

				// Update the reflection name since its useless
				reflection.name =
					importPath === 'index'
						? packages[cfg.packagePath].packageName
						: path.join(packages[cfg.packagePath].packageName, importPath);

				return true;
			}),
		);
	});

	// Since we merged multiple reflections together, we'll need to sort groups manually
	sortReflectionGroups(packagesWithDeepImports);

	// Sort packages by name
	return Object.values(packages).sort((a, b) => a.packageName.localeCompare(b.packageName));
}

export function extractMetadata(data: JSONOutput.Reflection): ApiMetadata {
	const { id, name, nextId, permalink, previousId } = data;

	return { id, name, nextId, permalink, previousId };
}

export function formatPackagesWithoutHostInfo(packages: PackageReflectionGroup[]) {
	return packages.map(({ readmePath, ...pkg }) => pkg);
}
