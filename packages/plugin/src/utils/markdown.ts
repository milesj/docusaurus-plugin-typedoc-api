import type { JSONOutput } from 'typedoc';
import { DeclarationReflectionMap } from '../types';

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
	reflectionList: JSONOutput.DeclarationReflection[],
	symbol: string,
	member: string,
) {
	return reflectionList.find((ref) => {
		if (ref.name !== symbol) {
			return false;
		}

		return member === '' ? true : ref.children?.some((child) => child.name === member);
	});
}

// TypeDoc JSON output does not replace links, so we need to do this manually.
// @see https://github.com/TypeStrong/typedoc/blob/master/src/lib/output/plugins/MarkedLinksPlugin.ts
export function replaceLinkTokens(markdown: string, reflections: DeclarationReflectionMap) {
	const reflectionList = Object.values(reflections);

	return markdown.replace(
		/{@(link|linkcode|linkplain)\s+([^}]+?)}/gi,
		(match: string, tagName: string, content: string): string => {
			const { caption, target } = splitLinkText(content);
			const [symbol, member = ''] = target.split('.');
			const reflection = findReflectionWithMatchingTarget(reflectionList, symbol, member);
			const label = tagName === 'linkcode' ? `\`${caption}\`` : caption;

			if (!reflection || !reflection.permalink) {
				return label;
			}

			return `[${label}](${reflection.permalink}${member ? `#${member}` : ''})`;
		},
	);
}
