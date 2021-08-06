// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/comment.hbs
import React from 'react';
import { JSONOutput } from 'typedoc';

export interface FlagsProps {
	flags?: JSONOutput.ReflectionFlags;
}

export function Flags({ flags }: FlagsProps) {
	if (!flags) {
		return null;
	}

	console.log('Flags', flags);

	return (
		<>
			{Object.keys(flags).map((flag) => (
				<span key={flag} className={`tsd-flag ts-flag${flag}`}>
					{flag}
				</span>
			))}
		</>
	);
}
