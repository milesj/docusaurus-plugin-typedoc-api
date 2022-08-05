import React from 'react';
import type { JSONOutput } from 'typedoc';
import { displayPartsToMarkdown } from './Comment';
import { Type } from './Type';

export interface DefaultValueProps {
	comment?: JSONOutput.Comment;
	type?: JSONOutput.SomeType | string;
}

function extractDefaultTag(comment?: JSONOutput.Comment): string | null {
	const tag = comment?.blockTags?.find((tag) => tag.tag === '@default');

	if (!tag) {
		return null;
	}

	return displayPartsToMarkdown(tag.content);
}

export function DefaultValue({ comment, type }: DefaultValueProps) {
	if (!comment && !type) {
		return null;
	}

	const defaultTag = extractDefaultTag(comment);

	if (!defaultTag && !type) {
		return null;
	}

	return (
		<span className="tsd-signature-symbol">
			{' = '}
			{type ? <>{typeof type === 'string' ? type : <Type type={type} />}</> : defaultTag}
		</span>
	);
}
