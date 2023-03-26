import type { PropVersionMetadata } from '@docusaurus/plugin-content-docs';
import type { DeclarationReflectionMap } from '../types';

function splitLinkText(text: string): { caption: string; target: string } {
	let splitIndex = text.indexOf('|');

	if (splitIndex === -1) {
		splitIndex = text.search(/\s/);
	}

	if (splitIndex !== -1) {
		return {
			caption: text
				.slice(splitIndex + 1)
				.replace(/\n+/, ' ')
				.trim(),
			target: text.slice(0, Math.max(0, splitIndex)).trim(),
		};
	}

	return {
		caption: text,
		target: text,
	};
}

function findReflectionWithMatchingTarget(
	reflections: DeclarationReflectionMap,
	symbol: string,
	member?: string,
) {
	return Object.values(reflections).find((ref) => {
		if (ref.name !== symbol) {
			return false;
		}

		return member ? ref.children?.some((child) => child.name === member) : true;
	});
}

function replaceApiLinks(
	reflections: DeclarationReflectionMap,
): (match: string, tagName: string, content: string) => string {
	return (match: string, tagName: string, content: string) => {
		const { caption, target } = splitLinkText(content);
		const [symbol, member] = target.split('.');
		const reflection = findReflectionWithMatchingTarget(reflections, symbol, member);
		const label = tagName === 'linkcode' ? `\`${caption}\`` : caption;

		if (!reflection?.permalink) {
			return label;
		}

		return `[${label}](${reflection.permalink}${member ? `#${member}` : ''})`;
	};
}

function replaceDocLinks(
	currentVersion: PropVersionMetadata,
): (match: string, content: string) => string {
	return (match: string, content: string) => {
		const { caption, target } = splitLinkText(content);
		const version = currentVersion.version === 'current' ? 'next' : currentVersion.version;

		// TODO: Handle `routeBasePath`? Something else besides "docs"?
		const url = currentVersion.isLast ? `/docs/${target}` : `/docs/${version}/${target}`;

		return `[${caption}](${url})`;
	};
}

// TypeDoc JSON output does not replace links, so we need to do this manually.
// @see https://github.com/TypeStrong/typedoc/blob/master/src/lib/output/plugins/MarkedLinksPlugin.ts
export function replaceLinkTokens(
	markdown: string,
	reflections: DeclarationReflectionMap,
	currentVersion: PropVersionMetadata,
) {
	return markdown
		.replace(/{@(link|linkcode|linkplain|apilink)\s+([^}]+?)}/gi, replaceApiLinks(reflections))
		.replace(/{@doclink\s+([^}]+?)}/gi, replaceDocLinks(currentVersion));
}
