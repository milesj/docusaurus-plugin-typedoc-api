import { JSONOutput } from 'typedoc';

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
