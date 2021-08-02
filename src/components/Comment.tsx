// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/comment.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { Markdown } from './Markdown';

export interface CommentProps {
	comment: JSONOutput.Comment;
}

export function hasComment(comment?: JSONOutput.Comment): boolean {
	if (!comment) {
		return false;
	}

	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	return Boolean(comment.text || comment.shortText || comment.tags?.length > 0);
}

export function Comment({ comment }: CommentProps) {
	if (hasComment(comment)) {
		return null;
	}

	console.log('Comment', comment);

	return (
		<div className="tsd-comment tsd-typography">
			{!!comment.shortText && (
				<div className="lead">
					<Markdown content={comment.shortText} />
				</div>
			)}

			{!!comment.text && <Markdown content={comment.text} />}

			{comment.tags?.length > 0 && (
				<dl className="tsd-comment-tags">
					{comment.tags.map((tag) => (
						<>
							<dt>{tag.tag}</dt>
							<dd>
								<Markdown content={tag.text} />
							</dd>
						</>
					))}
				</dl>
			)}
		</div>
	);
}
