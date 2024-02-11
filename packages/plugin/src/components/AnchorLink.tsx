import Link from '@docusaurus/Link';
import useBrokenLinks from '@docusaurus/useBrokenLinks';

export interface AnchorLinkProps {
	id: string;
}

export function AnchorLink({ id }: AnchorLinkProps) {
	useBrokenLinks().collectAnchor(id);

	return (
		<Link className="tsd-anchor" href={`#${id}`}>
			<span className="tsd-anchor-id" id={id} />
			<i className="codicon codicon-symbol-numeric" />
		</Link>
	);
}
