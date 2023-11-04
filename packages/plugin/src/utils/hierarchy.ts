import type { JSONOutput } from 'typedoc';

export interface HierarchyNode {
	types: JSONOutput.SomeType[];
	next?: HierarchyNode;
	isTarget?: boolean;
}

// The JSON output does not include hierarchy information, so we need to duplicate the logic!
// https://github.com/TypeStrong/typedoc/blob/master/src/lib/converter/plugins/TypePlugin.ts#L98
export function createHierarchy(reflection: JSONOutput.Reflection) {
	let root!: HierarchyNode;
	let hierarchy!: HierarchyNode;

	function push(types?: JSONOutput.SomeType[]) {
		if (!types) {
			return;
		}

		const level: HierarchyNode = { types };

		if (hierarchy) {
			hierarchy.next = level;
			hierarchy = level;
		} else {
			root = level;
			hierarchy = level;
		}
	}

	if ('extendedTypes' in reflection && reflection.extendedTypes) {
		push((reflection as JSONOutput.DeclarationReflection).extendedTypes);
	}

	push([
		{
			name: reflection.name,
			target: reflection.id,
			type: 'reference',
		},
	]);

	hierarchy.isTarget = true;

	if ('extendedBy' in reflection && reflection.extendedBy) {
		push((reflection as JSONOutput.DeclarationReflection).extendedBy);
	}

	return root;
}
