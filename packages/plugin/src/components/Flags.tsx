// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/comment.hbs
import React from 'react';
import type { JSONOutput } from 'typedoc';

function removePrefix(value: string) {
	return value.replace(/^is([A-Z])/, (match, char) => String(char).toLocaleLowerCase());
}

export interface FlagsProps {
	flags?: JSONOutput.ReflectionFlags;
}

export function Flags({ flags }: FlagsProps) {
	if (!flags) {
		return null;
	}

	return (
		<>
			{Object.keys(flags)
				.map(removePrefix)
				.map((flag) => (
					<span key={flag} className={`tsd-flag tsd-flag-${flag}`}>
						{flag}
					</span>
				))}
		</>
	);
}
