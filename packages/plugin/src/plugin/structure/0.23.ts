/* eslint-disable no-param-reassign */

import { JSONOutput } from 'typedoc';

interface OldComment {
	shortText?: string;
	text?: string;
	tags?: { tag: string; text: string }[];
}

interface OldDeclarationReflection {
	typeParameter?: JSONOutput.TypeParameterReflection[];
}

// https://github.com/TypeStrong/typedoc/releases/tag/v0.23.0
// https://github.com/milesj/docusaurus-plugin-typedoc-api/pull/50
export function migrateToVersion0230(reflection: JSONOutput.DeclarationReflection) {
	if (Array.isArray(reflection.getSignature)) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		reflection.getSignature = reflection.getSignature[0];
	}

	if (Array.isArray(reflection.setSignature)) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		reflection.setSignature = reflection.setSignature[0];
	}

	if ('typeParameter' in reflection) {
		reflection.typeParameters = (reflection as OldDeclarationReflection).typeParameter;
	}

	if (
		reflection.comment &&
		('shortText' in reflection.comment ||
			'text' in reflection.comment ||
			'tags' in reflection.comment)
	) {
		const comment = reflection.comment as OldComment;
		const summary: JSONOutput.CommentDisplayPart[] = [];

		if (comment.shortText) {
			summary.push({ kind: 'text', text: comment.shortText });
		}

		if (comment.text) {
			summary.push({ kind: 'text', text: comment.text });
		}

		reflection.comment = {
			blockTags: comment.tags?.map((tag) => ({
				content: [{ kind: 'text', text: tag.text }],
				name: tag.tag,
				tag: `@${tag.tag}`,
			})),
			summary,
		};
	}
}
