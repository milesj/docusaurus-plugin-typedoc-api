import fs from 'fs';
import path from 'path';
import { JSONOutput, ReflectionKind } from 'typedoc';
import { ApiMetadata, DeclarationReflectionMap } from '../types';
import { getKindSlug } from './url';

export function createReflectionMap(
	items: JSONOutput.DeclarationReflection[] = [],
): DeclarationReflectionMap {
	const map: DeclarationReflectionMap = {};

	items.forEach((item) => {
		map[item.id] = item;
	});

	return map;
}

async function loadPackageJsonAndReadme(initialDir: string) {
	let currentDir = initialDir;

	while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
		currentDir = path.dirname(currentDir);
	}

	const readmePath = path.join(currentDir, 'README.md');

	return {
		package: JSON.parse(
			await fs.promises.readFile(path.join(currentDir, 'package.json'), 'utf8'),
		) as {
			name: string;
			version: string;
		},
		readmePath: fs.existsSync(readmePath) ? readmePath : '',
	};
}

export async function addMetadataToDeclarations(
	projectRoot: string,
	pkgBase: JSONOutput.DeclarationReflection,
): Promise<JSONOutput.ProjectReflection> {
	const pkg = pkgBase as JSONOutput.ProjectReflection;
	const pkgMeta = await loadPackageJsonAndReadme(
		path.join(projectRoot, path.dirname(String(pkgBase.sources?.[0].fileName))),
	);

	pkg.name = pkg.name.replace('/src', '');
	pkg.packageName = pkgMeta.package.name;
	pkg.packageVersion = pkgMeta.package.version;
	pkg.readmePath = pkgMeta.readmePath;

	const slug = `/${pkg.name}`;
	const permalink = `/api${slug}`;
	const children: JSONOutput.DeclarationReflection[] = [];

	if (pkg.children) {
		pkg.children.forEach((child) => {
			const kindSlugPart = getKindSlug(child);
			const childSlug = kindSlugPart ? `${slug}/${kindSlugPart}/${child.name}` : slug;
			const childPermalink = `/api${childSlug + (kindSlugPart ? '' : `#${child.name}`)}`;

			children.push({
				...child,
				permalink: childPermalink,
				slug: childSlug,
			});
		});
	}

	return {
		...pkg,
		children,
		permalink,
		slug,
	};
}

export async function addMetadataToPackages(
	projectRoot: string,
	project: JSONOutput.ProjectReflection,
): Promise<JSONOutput.ProjectReflection[]> {
	const packages = (
		(project.kind === ReflectionKind.Project
			? project.children ?? []
			: [project]) as JSONOutput.DeclarationReflection[]
	).filter((pkg) => pkg.kind === ReflectionKind.Module);

	return Promise.all(packages.map((child) => addMetadataToDeclarations(projectRoot, child)));
}

export function extractMetadata(data: JSONOutput.Reflection): ApiMetadata {
	const { id, name, nextId, permalink, previousId, slug } = data;

	return { id, name, nextId, permalink, previousId, slug };
}
