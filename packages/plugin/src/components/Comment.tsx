// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/comment.hbs

import React from 'react';
import type { JSONOutput } from 'typedoc';
import { Markdown } from './Markdown';

export interface CommentProps {
	comment?: JSONOutput.Comment;
	root?: boolean;
}

export function hasComment(comment?: JSONOutput.Comment): boolean {
	if (!comment || !comment.summary || comment.summary.length === 0) {
		return false;
	}

	return Boolean(
		comment.summary.some((x) => x.kind !== 'text' || x.text !== '') ||
			(comment.blockTags && comment.blockTags?.length > 0),
	);
}

export function displayPartsToMarkdown(parts: JSONOutput.CommentDisplayPart[]): string {
	return parts.map((part) => part.text).join('');
}

export function Comment({ comment, root }: CommentProps) {
	if (!comment || !hasComment(comment)) {
		return null;
	}

	return (
		<div className={`tsd-comment tsd-typography ${root ? 'tsd-comment-root' : ''}`}>
			{!!comment.summary && (
				<div className="lead">
					<Markdown content={displayPartsToMarkdown(comment.summary)} />
				</div>
			)}

			{comment.blockTags && comment.blockTags.length > 0 && (
				<dl className="tsd-comment-tags">
					{comment.blockTags?.map((tag) => (
						<React.Fragment key={tag.tag}>
							<dt>
								<strong>{tag.tag}</strong>
							</dt>
							<dd>
								<Markdown content={displayPartsToMarkdown(tag.content)} />
							</dd>
						</React.Fragment>
					))}
				</dl>
			)}
		</div>
	);
}
