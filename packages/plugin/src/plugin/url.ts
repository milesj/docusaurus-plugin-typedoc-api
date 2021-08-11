import { JSONOutput, ReflectionKind } from 'typedoc';

export function getKindSlug(decl: JSONOutput.DeclarationReflection): string {
	switch (decl.kind) {
		case ReflectionKind.Module:
			return 'package';
		case ReflectionKind.Namespace:
			return 'namespace';
		case ReflectionKind.Enum:
			return 'enum';
		case ReflectionKind.Function:
			return 'function';
		case ReflectionKind.Class:
			return 'class';
		case ReflectionKind.Interface:
			return 'interface';
		default:
			return '';
	}
}
