/* eslint-disable react/no-array-index-key */

import React, { useState } from 'react';
import marked, { TokensList } from 'marked';
import MDX from '@theme/MDXComponents';
import { useReflectionMap } from '../hooks/useReflectionMap';
import { replaceLinkTokens } from '../utils/markdown';

marked.setOptions({
	gfm: true,
	headerIds: false,
	mangle: false,
	smartLists: true,
	smartypants: true,
});

const TOKEN_TO_TAG: Record<string, keyof JSX.IntrinsicElements> = {
	blockquote: 'blockquote',
	br: 'br',
	code: 'pre',
	codespan: 'code',
	def: 'span', // ???
	del: 'del',
	em: 'em',
	escape: 'span', // ???
	hr: 'hr',
	html: 'div',
	paragraph: 'p',
	strong: 'strong',
	table: 'table',
	tablecell: 'td',
	tablerow: 'tr',
};

function convertAstToElements(ast: TokensList): React.ReactNode[] | undefined {
	const elements: React.ReactNode[] = [];
	let counter = 0;

	// eslint-disable-next-line complexity
	ast.forEach((token) => {
		// Nested tokens aren't typed for some reason...
		const children = (token as unknown as { tokens: TokensList }).tokens ?? [];

		switch (token.type) {
			case 'code':
				elements.push(
					<MDX.pre key={counter} className={token.lang && `language-${token.lang}`}>
						{token.text}
					</MDX.pre>,
				);
				break;

			case 'codespan':
				// Non-raw is escaped and doesn't work with JSX, so use the raw value
				// but remove the wrapping backticks!
				elements.push(<MDX.code key={counter}>{token.raw.slice(1, -1)}</MDX.code>);
				break;

			case 'heading': {
				const Comp = MDX[`h${token.depth}` as 'h1'];
				elements.push(<Comp key={counter}>{convertAstToElements(children) ?? token.text}</Comp>);
				break;
			}

			case 'image':
				elements.push(<MDX.img key={counter} alt={token.title} src={token.href} />);
				break;

			case 'link':
				elements.push(
					<MDX.a key={counter} href={token.href} title={token.title}>
						{convertAstToElements(children) ?? token.text}
					</MDX.a>,
				);
				break;

			case 'list': {
				const Comp = token.ordered ? 'ol' : 'ul';
				elements.push(
					<Comp key={counter}>
						{convertAstToElements((token.items as TokensList) ?? children)}
					</Comp>,
				);
				break;
			}

			case 'list_item':
				elements.push(
					<li key={counter}>
						{token.task && (
							<>
								<input checked={token.checked} type="checkbox" />{' '}
							</>
						)}
						{convertAstToElements(children) ?? token.text}
					</li>,
				);
				break;

			case 'space':
				elements.push(token.raw || ' ');
				break;

			case 'table':
				elements.push(
					<table key={counter}>
						<thead>
							<tr>
								{token.header.map((h, i) => (
									<th key={i} align={token.align[i]!}>
										{convertAstToElements(h.tokens as TokensList)}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{token.rows.map((cells, i) => (
								<tr key={i}>
									{cells.map((c, i2) => (
										<td key={i2} align={token.align[i]!}>
											{convertAstToElements(c.tokens as TokensList)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>,
				);
				break;

			case 'text':
				elements.push(
					children.length === 0 ? (
						token.text
					) : (
						<React.Fragment key={counter}>{convertAstToElements(children)}</React.Fragment>
					),
				);
				break;

			default: {
				const Comp = TOKEN_TO_TAG[token.type] || token.type;
				const innerText = 'text' in token ? token.text : '';

				elements.push(<Comp key={counter}>{convertAstToElements(children) ?? innerText}</Comp>);
				break;
			}
		}

		counter += 1;
	});

	if (elements.length === 0) {
		return undefined;
	}

	return elements;
}

export interface MarkdownProps {
	content: string;
}

// Too bad we cant use `@mdx-js` here...
export function Markdown({ content }: MarkdownProps) {
	const reflections = useReflectionMap();
	const [ast] = useState<TokensList>(() => marked.lexer(replaceLinkTokens(content, reflections)));

	if (!content) {
		return null;
	}

	return <div className="tsd-markdown markdown">{convertAstToElements(ast)}</div>;
}
