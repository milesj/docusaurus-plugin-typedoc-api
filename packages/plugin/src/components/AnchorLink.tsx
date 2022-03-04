import React from 'react';

export interface AnchorLinkProps {
	id: string;
}

export function AnchorLink({ id }: AnchorLinkProps) {
	return (
		<a className="tsd-anchor" href={`#${id}`}>
			<span className="tsd-anchor-id" id={id} />
			<i className="codicon codicon-symbol-numeric" />
		</a>
	);
}
