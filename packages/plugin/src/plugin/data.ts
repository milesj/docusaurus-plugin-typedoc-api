import fs from 'fs';
import path from 'path';
import * as TypeDoc from 'typedoc';
import { JSONOutput, ReflectionKind } from 'typedoc';
import ts from 'typescript';
import { normalizeUrl } from '@docusaurus/utils';
import type {
	DeclarationReflectionMap,
	DocusaurusPluginTypeDocApiOptions,
	PackageReflectionGroup,
	ResolvedPackageConfig,
} from '../types';
import { migrateToVersion0230 } from './structure/0.23';
import { getKindSlug, getPackageSlug, joinUrl } from './url';

function shouldEmit(projectRoot: string, tsconfigPath: string) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
		skipErrorChecking: true,
		// Only emit when using project references
		emit: shouldEmit(projectRoot, tsconfig),
		// Only document the public API by default
		excludeExternals: true,
		excludeInternal: true,
		excludePrivate: true,
		excludeProtected: true,
		// Enable verbose logging when debugging
		logLevel: options.debug ? 'Verbose' : 'Info',
		inlineTags: [
			'@link',
			'@inheritDoc',
			'@label',
			'@linkcode',
			'@linkplain',
			'@apilink',
			'@doclink',
		] as `@${string}`[],
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

export function loadPackageJsonAndDocs(
	initialDir: string,
	pkgFileName: string = 'package.json',
	readmeFileName: string = 'README.md',
	changelogFileName: string = 'CHANGELOG.md',
) {
	let currentDir = initialDir;

	while (!fs.existsSync(path.join(currentDir, pkgFileName))) {
		currentDir = path.dirname(currentDir);
	}

	const readmePath = path.join(currentDir, readmeFileName);
	const changelogPath = path.join(currentDir, changelogFileName);

	return {
		packageJson: JSON.parse(fs.readFileSync(path.join(currentDir, pkgFileName), 'utf8')) as {
			name: string;
			version: string;
		},
		readmePath: fs.existsSync(readmePath) ? readmePath : '',
		changelogPath: fs.existsSync(changelogPath) ? changelogPath : '',
	};
}

export function addMetadataToReflections(
	project: JSONOutput.ProjectReflection,
	packageSlug: string,
	urlPrefix: string,
): JSONOutput.ProjectReflection {
	const permalink = `/${joinUrl(urlPrefix, packageSlug)}`;

	if (project.children) {
		// eslint-disable-next-line no-param-reassign
		project.children = project.children.map((child) => {
			migrateToVersion0230(child);

			const kindSlugPart = getKindSlug(child);
			const childSlug = kindSlugPart ? `/${kindSlugPart}/${child.name}` : `#${child.name}`;
			const childPermalink = permalink + childSlug;

			// We need to go another level deeper and only use fragments
			if (child.kind === ReflectionKind.Namespace && child.children) {
				// eslint-disable-next-line no-param-reassign
				child.children = child.children.map((grandChild) => ({
					...grandChild,
					permalink: normalizeUrl([`${childPermalink}#${grandChild.name}`]),
				}));
			}

			return {
				...child,
				permalink: normalizeUrl([childPermalink]),
			};
		});
	}

	return {
		...project,
		permalink: normalizeUrl([permalink]),
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
	{ deep, single }: { deep: boolean; single: boolean },
): boolean {
	// Single package
	if (single) {
		return (
			// src/index.ts === src/index.ts
			(!deep && sourceFile === entryPoint) ||
			// index.ts === src/index.ts
			(!deep && sourceFile === path.basename(entryPoint)) ||
			// some/deep/file.ts === ...
			deep
		);
	}

	// Multiple packages
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
	isSinglePackage: boolean,
): JSONOutput.ProjectReflection[] {
	const modules: JSONOutput.ProjectReflection[] = [];

	const inheritChildren = () => {
		project.children?.forEach((child) => {
			if (child.kind === ReflectionKind.Module) {
				modules.push(child);
			}
		});
	};

	// Single packages are extremely difficult, as the TypeDoc structure is
	// different for every kind of package entry point pattern
	if (isSinglePackage) {
		const hasNoModules = project.children?.every((child) => child.kind !== ReflectionKind.Module);

		if (hasNoModules) {
			// No "module" children:
			//	- Polyrepos
			//	- Monorepos with 1 package
			modules.push(project);
		} else {
			// Has "module" children:
			//	- Polyrepos with deep imports
			//	- Polyrepos with multi-imports
			//	- Monorepos
			inheritChildren();
		}

		// Multiple packages are extremely simple, as every package is a module reflection
		// as a child on the top-level project reflection
	} else {
		inheritChildren();
	}

	return modules;
}

export function flattenAndGroupPackages(
	packageConfigs: ResolvedPackageConfig[],
	project: JSONOutput.ProjectReflection,
	urlPrefix: string,
	options: DocusaurusPluginTypeDocApiOptions,
	versioned: boolean = false,
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
				const relEntryPoint = joinUrl(cfg.packagePath, entry.path);
				const isUsingDeepImports = !entry.path.match(/\.tsx?$/);

				if (
					!matchesEntryPoint(relSourceFile, relEntryPoint, {
						deep: isUsingDeepImports,
						single: isSinglePackage,
					})
				) {
					return false;
				}

				// We have a matching entry point, so store the record
				if (!packages[cfg.packagePath]) {
					const { packageJson, readmePath, changelogPath } = loadPackageJsonAndDocs(
						path.join(options.projectRoot, cfg.packagePath),
						options.packageJsonName,
						options.readmeName,
						options.changelogName,
					);

					packages[cfg.packagePath] = {
						entryPoints: [],
						packageName: (versioned && cfg.packageName) || packageJson.name,
						packageVersion: (versioned && cfg.packageVersion) || packageJson.version,
						readmePath,
						changelogPath,
					};

					// eslint-disable-next-line no-param-reassign
					cfg.packageName = packages[cfg.packagePath].packageName;
					// eslint-disable-next-line no-param-reassign
					cfg.packageVersion = packages[cfg.packagePath].packageVersion;
				}

				// Add metadata to package and children reflections
				const urlSlug = getPackageSlug(cfg, importPath, isSinglePackage);
				const reflection = addMetadataToReflections(mod, urlSlug, urlPrefix);
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
						: joinUrl(packages[cfg.packagePath].packageName, importPath);

				return true;
			}),
		);
	});

	// Since we merged multiple reflections together, we'll need to sort groups manually
	sortReflectionGroups(packagesWithDeepImports);

	// Sort packages by name
	return Object.values(packages).sort((a, b) => a.packageName.localeCompare(b.packageName));
}

export function formatPackagesWithoutHostInfo(packages: PackageReflectionGroup[]) {
	return packages.map(({ changelogPath, readmePath, ...pkg }) => pkg);
}
