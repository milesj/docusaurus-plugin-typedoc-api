import { JSONOutput } from 'typedoc';
import { ApiMetadata, DeclarationInfo, PackageInfo } from './types';
import { getKindSlug } from './url';

export type DeclarationReflectionMap = Record<number, JSONOutput.DeclarationReflection>;

export function createDeclarationMap(
	items: JSONOutput.DeclarationReflection[] = [],
): DeclarationReflectionMap {
	const map: DeclarationReflectionMap = {};

	items.forEach((item) => {
		map[item.id] = item;
	});

	return map;
}

export function addMetadataToReflections(pkg: JSONOutput.DeclarationReflection): PackageInfo {
	// eslint-disable-next-line no-param-reassign
	pkg.name = pkg.name.replace('/src', '');

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

export function extractMetadata(data: DeclarationInfo | PackageInfo): ApiMetadata {
	const { id, name, nextId, permalink, previousId, slug } = data;

	return { id, name, nextId, permalink, previousId, slug };
}
