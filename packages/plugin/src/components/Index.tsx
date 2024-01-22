import { Fragment } from 'react';
import Link from '@docusaurus/Link';
import { useRequiredReflection } from '../hooks/useReflection';
import type { TSDDeclarationReflection } from '../types';
import { escapeMdx } from '../utils/helpers';
import { AnchorLink } from './AnchorLink';
import { Icon } from './Icon';

export interface IndexChildProps {
	id: number;
}

function IndexChild({ id }: IndexChildProps) {
	const reflection = useRequiredReflection(id);

	return (
		<li>
			<Link className="tsd-kind-icon" to={reflection.permalink ?? `#${reflection.name}`}>
				<Icon reflection={reflection} />
				{escapeMdx(reflection.name)}
			</Link>
		</li>
	);
}

export interface IndexProps {
	reflection: TSDDeclarationReflection;
}

export function Index({ reflection }: IndexProps) {
	if (reflection.categories && reflection.categories.length > 0) {
		return (
			<section className="tsd-panel-group tsd-index-group">
				<h2>
					Index <AnchorLink id="Index" />
				</h2>

				<section className="tsd-panel tsd-index-panel">
					<div className="tsd-index-content">
						{reflection.categories.map((category) => (
							<section key={category.title} className="tsd-index-section">
								<h3 className="tsd-panel-header">
									{category.title === '__CATEGORY__' ? 'Other' : category.title}
								</h3>

								<div className="tsd-panel-content">
									<ul className="tsd-index-list">
										{category.children?.map((child) => <IndexChild key={child} id={child} />)}
									</ul>
								</div>
							</section>
						))}
					</div>
				</section>
			</section>
		);
	}

	if (reflection.groups && reflection.groups.length > 0) {
		return (
			<section className="tsd-panel-group tsd-index-group">
				<h2>
					Index <AnchorLink id="Index" />
				</h2>

				<section className="tsd-panel tsd-index-panel">
					<div className="tsd-index-content">
						{reflection.groups.map((group) => (
							<section key={group.title} className="tsd-index-section">
								{group.categories && group.categories.length > 0 ? (
									group.categories.map((category) => (
										<Fragment key={category.title}>
											<h3 className="tsd-panel-header">
												{category.title === '__CATEGORY__' ? group.title : category.title}
											</h3>

											<div className="tsd-panel-content">
												<ul className="tsd-index-list">
													{category.children?.map((child) => <IndexChild key={child} id={child} />)}
												</ul>
											</div>
										</Fragment>
									))
								) : (
									<>
										<h3 className="tsd-panel-header">{group.title}</h3>

										<div className="tsd-panel-content">
											<ul className="tsd-index-list">
												{group.children?.map((child) => <IndexChild key={child} id={child} />)}
											</ul>
										</div>
									</>
								)}
							</section>
						))}
					</div>
				</section>
			</section>
		);
	}

	return null;
}
