import fs from 'fs';
import path from 'path';
import { JSONOutput, ReflectionKind } from 'typedoc';
import * as TypeDoc from 'typedoc';
import ts from 'typescript';
import { normalizeUrl } from '@docusaurus/utils';
import {
	ApiMetadata,
	DeclarationReflectionMap,
	DocusaurusPluginTypeDocApiOptions,
	PackageReflectionGroup,
	ResolvedPackageConfig,
} from '../types';
import { getKindSlug, getPackageSlug } from './url';

function shouldEmit(projectRoot: string, tsconfigPath: string) {
	const { config, error } = ts.readConfigFile(tsconfigPath, (name) =>
		fs.readFileSync(name, 'utf8'),
	);

	if (error) {
		throw new Error(`Failed to load ${tsconfigPath}`);
	}

	const result = ts.parseJsonConfigFileContent(config, ts.sys, projectRoot, {}, tsconfigPath);

	if (result.errors.length > 0) {
		throw new Error(`Failed to parse ${tsconfigPath}`);
	}

	return result.projectReferences && result.projectReferences.length > 0 ? 'docs' : 'none';
}

// Persist build state as a global, since the plugin is re-evaluated every hot reload.
// Because of this, we can't use state in the plugin or module scope.
if (!global.typedocBuild) {
	global.typedocBuild = { count: 0 };
}

export async function generateJson(
	projectRoot: string,
	entryPoints: string[],
	outFile: string,
	options: DocusaurusPluginTypeDocApiOptions,
): Promise<boolean> {
	/* eslint-disable sort-keys */

	// Running the TypeDoc compiler is pretty slow...
	// We should only load on the 1st build, and use cache for subsequent reloads.
	if (global.typedocBuild.count > 0 && fs.existsSync(outFile)) {
		return true;
	}

	const app = new TypeDoc.Application();
	const tsconfig = path.join(projectRoot, options.tsconfigName!);

	app.options.addReader(new TypeDoc.TSConfigReader());
	app.options.addReader(new TypeDoc.TypeDocReader());

	app.bootstrap({
		// Only emit when using project references
		emit: shouldEmit(projectRoot, tsconfig),
		// Only document the public API by default
		excludeExternals: true,
		excludeInternal: true,
		excludePrivate: true,
		excludeProtected: true,
		// Enable verbose logging when debugging
		logLevel: options.debug ? 'Verbose' : 'Info',
		...options.typedocOptions,
		// Control how config and packages are detected
		tsconfig,
		entryPoints: entryPoints.map((ep) => path.join(projectRoot, ep)),
		entryPointStrategy: 'expand',
		exclude: options.exclude,
		// We use a fake category title so that we can fallback to the parent group
		defaultCategory: 'CATEGORY',
	});

	const project = app.convert();

	if (project) {
		await app.generateJson(project, outFile);

		global.typedocBuild.count += 1;

		return true;
	}

	return false;
}

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
	basePath: string = 'api',
): JSONOutput.ProjectReflection {
	const permalink = `/${basePath}/${packageSlug}`;
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
						path.join(options.projectRoot, cfg.packagePath),
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
				const reflection = addMetadataToReflections(mod, urlSlug, baseUrl, options.routeBasePath);
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
