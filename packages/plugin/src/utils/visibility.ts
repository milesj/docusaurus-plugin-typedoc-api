import type { JSONOutput } from 'typedoc';
import type { DeclarationReflectionMap } from '../types';

// https://github.com/TypeStrong/typedoc/blob/master/src/lib/output/themes/DefaultTheme.ts#L264
export function hasOwnDocument(id: number, reflections: DeclarationReflectionMap): boolean {
	const reflection = reflections[id];

	return Boolean(reflection?.permalink && !reflection.permalink.includes('#'));
}

// https://github.com/TypeStrong/typedoc/blob/2103f347c9cba40fcaa1f67e36f7cea0bdea2f0f/src/lib/models/ReflectionCategory.ts#L44
export function allCategoryChildrenHaveOwnDocument(
	category: JSONOutput.ReflectionCategory,
	reflections: DeclarationReflectionMap,
): boolean {
	let onlyOwnDocuments = true;

	category.children?.forEach((child) => {
		onlyOwnDocuments &&= hasOwnDocument(child, reflections);
	});

	return onlyOwnDocuments;
}

// https://github.com/TypeStrong/typedoc/blob/2103f347c9cba40fcaa1f67e36f7cea0bdea2f0f/src/lib/models/ReflectionGroup.ts#L81
export function allGroupChildrenHaveOwnDocument(
	group: JSONOutput.ReflectionGroup,
	reflections: DeclarationReflectionMap,
): boolean {
	return Boolean(group.children?.every((child) => hasOwnDocument(child, reflections)));
}
