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

// TypeDoc JSON output does not replace links, so we need to do this manually.
// @see https://github.com/TypeStrong/typedoc/blob/master/src/lib/output/plugins/MarkedLinksPlugin.ts
export function replaceLinkTokens(markdown: string, reflections: DeclarationReflectionMap) {
	const reflectionList = Object.values(reflections);

	return markdown.replace(
		// eslint-disable-next-line unicorn/no-unsafe-regex
		/(?:\[(.+?)])?{@(link|linkcode|linkplain)\s+([\n.]+?)}/gi,
		(match: string, leading: string, tagName: string, content: string): string => {
			const { caption, target } = splitLinkText(content);
			const [symbol, member = ''] = target.split('.');
			const reflection = reflectionList.find((ref) => ref.name === symbol);

			if (!reflection || !reflection.permalink) {
				return `\`${target}\``;
			}

			return `[${leading || caption}](${reflection.permalink}${member ? `#${member}` : ''})`;
		},
	);
}
