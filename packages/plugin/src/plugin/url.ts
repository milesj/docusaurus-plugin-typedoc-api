import path from 'path';
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

export function getPackageSlug(packagePath: string, entryPoint: string): string {
	// packages/foo -> foo
	const packageFolder = path.basename(packagePath);

	// src/bar.ts -> bar
	const entryName = entryPoint
		.replace(/\.tsx?$/, '')
		.replace(/(src|sources)\//, '')
		.replace(/\\/g, '-');

	if (entryName === 'index') {
		return packageFolder;
	}

	return `${packageFolder}-${entryName}`;
}
