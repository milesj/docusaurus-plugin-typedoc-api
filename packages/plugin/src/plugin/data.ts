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

	modules.forEach((mod) => {
		const relEntrySourceFile = mod.sources?.[0]?.fileName;

		packageConfigs.some((cfg) =>
			cfg.entryPoints.some((entry) => {
				const relEntryPoint = path.join(cfg.packagePath, entry.file);

				if (relEntrySourceFile !== relEntryPoint) {
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
				const urlSlug = getPackageSlug(cfg.packagePath, entry.file);
				const reflection = addMetadataToReflections(mod, urlSlug);

				packages[cfg.packagePath].entryPoints.push({
					index: entry.file.endsWith('index.ts'),
					label: entry.label,
					reflection,
					urlSlug,
				});

				// TODO
				// Update the reflection name since its useless
				reflection.name = path.join(packages[cfg.packagePath].packageName, entry.file);

				return true;
			}),
		);
	});

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
