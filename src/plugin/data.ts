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
		readme: fs.existsSync(readmePath) ? await fs.promises.readFile(readmePath, 'utf8') : '',
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
	pkg.readme = pkgMeta.readme;

	const slug = `/${pkg.name}`;
	const permalink = `/api${slug}`;
	const children: JSONOutput.DeclarationReflection[] = [];

	if (pkg.children) {
		pkg.children.forEach((child, index) => {
			const previousId = pkg.children[index - 1]?.id ?? undefined;
			const nextId = pkg.children[index + 1]?.id ?? undefined;
			const kindSlugPart = getKindSlug(child);
			const childSlug = kindSlugPart ? `${slug}/${kindSlugPart}/${child.name}` : slug;
			const childPermalink = `/api${childSlug + (kindSlugPart ? '' : `#${child.name}`)}`;

			children.push({
				...child,
				nextId,
				permalink: childPermalink,
				previousId,
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
