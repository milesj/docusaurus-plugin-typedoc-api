/* eslint-disable no-fallthrough */

import type { ReflectionKind } from 'typedoc';

// We have to map these manually instead of using the `ReflectionKind` enum,
// otherwise the `typedoc` package ends up in the bundle and crashes.
const KIND_ICONS: Record<ReflectionKind, string> = {
	0: 'project', // Project
	1: 'package', // Module
	2: 'symbol-namespace', // Namespace
	4: 'symbol-enum', // Enum
	16: 'symbol-enum-member', // EnumMember
	32: 'symbol-variable', // Variable
	64: 'symbol-function', // Function
	128: 'symbol-class', // Class
	256: 'symbol-interface', // Interface
	512: 'symbol-constructor', // Constructor
	1024: 'symbol-property', // Property
	2048: 'symbol-method', // Method
	4096: 'symbol-method', // CallSignature
	8192: 'json', // IndexSignature
	16_384: 'symbol-method', // ConstructorSignature
	32_768: 'symbol-property', // Parameter
	65_536: 'symbol-keyword', // TypeLiteral
	131_072: 'symbol-type-parameter', // TypeParameter
	262_144: 'symbol-constant', // Accessor
	524_288: 'symbol-property', // GetSignature
	1_048_576: 'symbol-property', // SetSignature
	2_097_152: 'json', // ObjectLiteral
	4_194_304: 'symbol-parameter', // TypeAlias
	8_388_608: 'symbol-event', // Event
	16_777_216: 'symbol-key', // Reference
};

export function getKindIcon(kind: ReflectionKind, name: string): string {
	let icon = KIND_ICONS[kind];

	// Use event icon when property starts with "on"
	if (kind === 1024 && name.match(/^on[A-Z]/)) {
		icon = KIND_ICONS[8_388_608];
	}

	return icon;
}

// eslint-disable-next-line complexity
export function getKindIconColor(kind: ReflectionKind): string {
	switch (kind) {
		// Function
		case 64:
		// Constructor
		case 512:
		// Method
		case 2048:
		// CallSignature
		case 4096:
		// ConstructorSignature
		case 16_384:
		// Accessor
		case 262_144:
			return 'var(--ifm-color-info)';

		// EnumMember
		case 16:
		// Variable
		case 32:
		// Property
		case 1024:
		// GetSignature
		case 524_288:
		// SetSignature
		case 1_048_576:
			return 'var(--ifm-color-success-lighter)';

		// Namespace
		case 2:
		// Class
		case 128:
			return 'var(--ifm-color-warning)';

		// Enum
		case 4:
		// Interface
		case 256:
		// TypeAlias
		case 4_194_304:
			return 'var(--ifm-color-danger-light)';

		default:
			return 'inherit';
	}
}

export function getKindIconHtml(kind: ReflectionKind, name: string): string {
	const icon = getKindIcon(kind, name);

	if (!icon) {
		return '';
	}

	const color = getKindIconColor(kind);

	return `<i class="codicon codicon-${icon}" style="color:${color};"></i>`;
}