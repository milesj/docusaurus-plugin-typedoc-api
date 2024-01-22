// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.declaration.hbs

import { useMinimalLayout } from '../hooks/useMinimalLayout';
import { useReflection } from '../hooks/useReflection';
import { escapeMdx } from '../utils/helpers';
import { Comment, hasComment } from './Comment';
import { DefaultValue } from './DefaultValue';
import { Icon } from './Icon';
import { MemberSources } from './MemberSources';
import { Parameter } from './Parameter';
import { extractDeclarationFromType, Type } from './Type';
import { TypeParameters } from './TypeParameters';
import { TypeParametersGeneric } from './TypeParametersGeneric';

export interface MemberDeclarationProps {
	id: number;
}

export function MemberDeclaration({ id }: MemberDeclarationProps) {
	const reflection = useReflection(id);
	const minimal = useMinimalLayout();
	const showTypes = reflection.typeParameters && reflection.typeParameters.length > 0;
	const showDeclaration = !minimal && extractDeclarationFromType(reflection.type);

	return (
		<>
			<div className="tsd-panel-content">
				<div className="tsd-signature tsd-kind-icon">
					<Icon reflection={reflection} />
					{escapeMdx(reflection.name)}
					<TypeParametersGeneric params={reflection.typeParameters} />
					<span className="tsd-signature-symbol">{reflection.flags?.isOptional && '?'}: </span>{' '}
					<Type type={reflection.type} />
					<DefaultValue
						comment={reflection.comment}
						type={reflection.type}
						value={reflection.defaultValue}
					/>
				</div>
			</div>

			<div className="tsd-panel-content">
				<MemberSources reflection={reflection} />

				<Comment comment={reflection.comment} />

				{hasComment(reflection.comment) && (showTypes || showDeclaration) && (
					<hr className="tsd-divider" />
				)}

				{showTypes && (
					<div className="tds-type-parameters">
						<h4 className="tsd-type-parameters-title">Type parameters</h4>
						<TypeParameters params={reflection.typeParameters} />
					</div>
				)}

				{showDeclaration && (
					<div className="tsd-type-declaration">
						<h4>Type declaration</h4>
						<Parameter param={extractDeclarationFromType(reflection.type)} />
					</div>
				)}
			</div>
		</>
	);
}
