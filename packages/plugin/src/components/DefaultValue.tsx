/* eslint-disable react-perf/jsx-no-new-object-as-prop */

import React from 'react';
import type { JSONOutput } from 'typedoc';
import { displayPartsToMarkdown } from './Comment';
import { Type } from './Type';

export interface DefaultValueProps {
	comment?: JSONOutput.Comment;
	type?: { type: string };
	value?: JSONOutput.SomeType | string;
}

function extractDefaultTag(comment?: JSONOutput.Comment): string | null {
	const tag = comment?.blockTags?.find((tag) => tag.tag === '@default');

	if (!tag) {
		return null;
	}

	return displayPartsToMarkdown(tag.content);
}

export function DefaultValue({ comment, value, type }: DefaultValueProps) {
	if (!comment && !value) {
		return null;
	}

	const defaultTag = extractDefaultTag(comment);

	if (!defaultTag && !value) {
		return null;
	}

	return (
		<span className="tsd-signature-symbol">
			{' = '}

			{value && <>{typeof value === 'string' ? value : <Type type={value} />}</>}

			{!value && defaultTag && (
				<Type
					type={{ type: 'literal', ...(type?.type === 'intrinsic' ? {} : type), value: defaultTag }}
				/>
			)}
		</span>
	);
}
