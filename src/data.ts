import fs from 'fs';
import path from 'path';
import { JSONOutput, ReflectionKind } from 'typedoc';
import { ApiMetadata, DeclarationInfo, PackageInfo } from './types';
import { getKindSlug } from './url';

export type DeclarationInfoMap = Record<number, DeclarationInfo>;

export function createDeclarationMap(items: DeclarationInfo[] = []): DeclarationInfoMap {
	const map: DeclarationInfoMap = {};

	items.forEach((item) => {
		map[item.id] = item;
	});

	return map;
}

async function loadPackageJson(initialDir: string) {
	let currentDir = initialDir;

	while (!fs.existsSync(path.join(currentDir, 'package.json'))) {
		currentDir = path.dirname(currentDir);
	}

	return JSON.parse(await fs.promises.readFile(path.join(currentDir, 'package.json'), 'utf8')) as {
		name: string;
		version: string;
	};
}

export async function addMetadataToDeclarations(
	projectRoot: string,
	pkgBase: JSONOutput.DeclarationReflection,
): Promise<PackageInfo> {
	const pkg = pkgBase as PackageInfo;
	const pkgJson = await loadPackageJson(
		path.join(projectRoot, path.dirname(String(pkgBase.sources?.[0].fileName))),
	);

	pkg.name = pkg.name.replace('/src', '');
	pkg.packageName = pkgJson.name;
	pkg.packageVersion = pkgJson.version;

	const slug = `/${pkg.name}`;
	const permalink = `/api${slug}`;
	const children: DeclarationInfo[] = [];

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
): Promise<PackageInfo[]> {
	const packages = (
		project.kind === ReflectionKind.Project ? project.children ?? [] : [project]
	).filter((pkg) => pkg.kind === ReflectionKind.Module) as JSONOutput.DeclarationReflection[];

	return Promise.all(packages.map((child) => addMetadataToDeclarations(projectRoot, child)));
}

export function extractMetadata(data: DeclarationInfo | PackageInfo): ApiMetadata {
	const { id, name, nextId, permalink, previousId, slug } = data;

	return { id, name, nextId, permalink, previousId, slug };
}
