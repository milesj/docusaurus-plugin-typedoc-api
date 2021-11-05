import fs from 'fs';
import path from 'path';
import { JSONOutput, ReflectionKind } from 'typedoc';
import { normalizeUrl } from '@docusaurus/utils';
import {
	ApiMetadata,
	DeclarationReflectionMap,
	DocusaurusPluginTypeDocApiOptions,
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

function loadPackageJsonAndReadme(
	initialDir: string,
	pkgFileName: string = 'package.json',
	readmeFileName: string = 'README.md',
) {
	let currentDir = initialDir;

	while (!fs.existsSync(path.join(currentDir, pkgFileName))) {
		currentDir = path.dirname(currentDir);
	}

	const readmePath = path.join(currentDir, readmeFileName);

	return {
		packageJson: JSON.parse(fs.readFileSync(path.join(currentDir, pkgFileName), 'utf8')) as {
			name: string;
			version: string;
		},
		readmePath: fs.existsSync(readmePath) ? readmePath : '',
	};
}

export function addMetadataToReflections(
	project: JSONOutput.ProjectReflection,
	packageSlug: string,
	baseUrl: string,
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
				permalink: normalizeUrl([baseUrl, childPermalink]),
			});
		});
	}

	return {
		...project,
		children,
		permalink: normalizeUrl([baseUrl, permalink]),
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

function matchesEntryPoint(
	sourceFile: string,
	entryPoint: string,
	{ deep, poly }: { deep: boolean; poly: boolean },
): boolean {
	// Polyrepo
	if (poly) {
		return (
			// src/index.ts === src/index.ts
			(!deep && sourceFile === entryPoint) ||
			// index.ts === src/index.ts
			(!deep && sourceFile === path.basename(entryPoint)) ||
			// some/deep/file.ts === ...
			deep
		);
	}

	// Monorepo
	return (
		// packages/foo/src/index.ts === packages/foo/src/index.ts
		// foo/src/index.ts ~ packages/foo/src/index.ts
		(!deep && (sourceFile === entryPoint || entryPoint.endsWith(sourceFile))) ||
		// packages/foo/src/some/deep/file.ts === packages/foo/src/
		(deep && sourceFile.startsWith(entryPoint))
	);
}

function extractReflectionModules(
	project: JSONOutput.ProjectReflection,
	isPolyrepo: boolean,
): JSONOutput.ProjectReflection[] {
	const modules: JSONOutput.ProjectReflection[] = [];

	const inheritChildren = () => {
		project.children?.forEach((child) => {
			if (child.kind === ReflectionKind.Module) {
				modules.push(child);
			}
		});
	};

	// Polyrepos are extremely difficult, as the TypeDoc structure is
	// different for every kind of package entry point pattern
	if (isPolyrepo) {
		const hasNoModules = project.children?.every((child) => child.kind !== ReflectionKind.Module);

		// Standard entry point through index.ts only
		// No "module" children, but has groups/sources/etc on the "project"
		if (hasNoModules) {
			modules.push(project);
			// Multi/deep imports have "module" children
		} else {
			inheritChildren();
		}

		// Monorepo is extremely simple, as every package is a module reflection
		// as a child on the top-level project reflection
	} else {
		inheritChildren();
	}

	return modules;
}

export function flattenAndGroupPackages(
	packageConfigs: ResolvedPackageConfig[],
	project: JSONOutput.ProjectReflection,
	baseUrl: string,
	options: DocusaurusPluginTypeDocApiOptions,
): PackageReflectionGroup[] {
	const isSinglePackage = packageConfigs.length === 1;
	const modules = extractReflectionModules(project, isSinglePackage);

	// Loop through every TypeDoc module and group based on package and entry point
	const packages: Record<string, PackageReflectionGroup> = {};
	const packagesWithDeepImports: JSONOutput.ProjectReflection[] = [];

	modules.forEach((mod) => {
		const relSourceFile = mod.sources?.[0]?.fileName ?? '';

		packageConfigs.some((cfg) =>
			Object.entries(cfg.entryPoints).some(([importPath, entry]) => {
				const relEntryPoint = path.join(cfg.packagePath, entry.path);
				const isUsingDeepImports = !entry.path.match(/\.tsx?$/);

				if (
					!matchesEntryPoint(relSourceFile, relEntryPoint, {
						deep: isUsingDeepImports,
						poly: isSinglePackage,
					})
				) {
					return false;
				}

				// We have a matching entry point, so store the record
				if (!packages[cfg.packagePath]) {
					const { packageJson, readmePath } = loadPackageJsonAndReadme(
						cfg.absolutePath,
						options.packageJsonName,
						options.readmeName,
					);

					packages[cfg.packagePath] = {
						entryPoints: [],
						packageName: packageJson.name,
						packageVersion: packageJson.version,
						readmePath,
					};
				}

				// Add metadata to package and children reflections
				const urlSlug = getPackageSlug(cfg, importPath);
				const reflection = addMetadataToReflections(mod, urlSlug, baseUrl);
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
