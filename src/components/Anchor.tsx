import React from 'react';

export interface AnchorProps {
	id: string;
}

export function Anchor({ id }: AnchorProps) {
	return (
		<a id={id} href={`#${id}`} className="tsd-anchor">
			<i className="codicon codicon-symbol-numeric" />
		</a>
	);
}
