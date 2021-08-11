import React from 'react';

export interface AnchorProps {
	id: string;
}

export function Anchor({ id }: AnchorProps) {
	return (
		<a className="tsd-anchor" href={`#${id}`} id={id}>
			<i className="codicon codicon-symbol-numeric" />
		</a>
	);
}
