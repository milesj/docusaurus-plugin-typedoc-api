import type { JSONOutput } from 'typedoc';

export interface HierarchyNode {
	types: JSONOutput.SomeType[];
	next?: HierarchyNode;
	isTarget?: boolean;
}

// The JSON output does not include hierarchy information, so we need to duplicate the logic!
// https://github.com/TypeStrong/typedoc/blob/master/src/lib/converter/plugins/TypePlugin.ts#L98
export function createHierarchy(reflection: JSONOutput.DeclarationReflection) {
	let root!: HierarchyNode;
	let hierarchy!: HierarchyNode;

	function push(types: JSONOutput.SomeType[]) {
		const level: HierarchyNode = { types };

		if (hierarchy) {
			hierarchy.next = level;
			hierarchy = level;
		} else {
			root = level;
			hierarchy = level;
		}
	}

	if (reflection.extendedTypes) {
		push(reflection.extendedTypes);
	}

	push([
		{
			id: reflection.id,
			name: reflection.name,
			type: 'reference',
		},
	]);

	hierarchy.isTarget = true;

	if (reflection.extendedBy) {
		push(reflection.extendedBy);
	}

	return root;
}
