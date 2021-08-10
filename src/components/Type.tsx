/* eslint-disable @typescript-eslint/restrict-plus-operands */
// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/type.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import Link from '@docusaurus/Link';
import { useReflectionMap } from '../hooks/useReflectionMap';
import { MemberSignatureTitle } from './MemberSignatureTitle';

function wrapWithParens(type: JSONOutput.SomeType): boolean {
	return type.type === 'union' || type.type === 'intersection';
}

export interface TypeProps {
	needsParens?: boolean;
	type?: JSONOutput.SomeType;
}

// eslint-disable-next-line complexity
export function Type({ needsParens, type: base }: TypeProps) {
	const reflections = useReflectionMap();
	let value: React.ReactNode;

	if (!base) {
		return null;
	}

	switch (base.type) {
		case 'array': {
			const type = base as JSONOutput.ArrayType;
			value = (
				<>
					<Type needsParens={wrapWithParens(type.elementType)} type={type.elementType} />
					<span className="tsd-signature-symbol">[]</span>
				</>
			);
			break;
		}

		case 'conditional': {
			const type = base as JSONOutput.ConditionalType;
			value = (
				<>
					<Type needsParens type={type.checkType} />
					<span className="tsd-signature-symbol"> extends </span>
					<Type type={type.extendsType} />
					<span className="tsd-signature-symbol"> ? </span>
					<Type type={type.trueType} />
					<span className="tsd-signature-symbol"> : </span>
					<Type type={type.falseType} />
				</>
			);
			break;
		}

		case 'indexedAccess': {
			const type = base as JSONOutput.IndexedAccessType;
			value = (
				<>
					<Type type={type.objectType} />
					<span className="tsd-signature-symbol">[</span>
					<Type type={type.indexType} />
					<span className="tsd-signature-symbol">]</span>
				</>
			);
			break;
		}

		case 'inferred': {
			const type = base as JSONOutput.InferredType;
			value = (
				<>
					<span className="tsd-signature-symbol">infer </span> {type.name}
				</>
			);
			break;
		}

		case 'intersection': {
			const type = base as JSONOutput.IntersectionType;
			value = type.types.map((t, i) => (
				<React.Fragment key={t.type + i}>
					{i > 0 && <span className="tsd-signature-symbol"> &amp; </span>}
					<Type needsParens={wrapWithParens(t)} type={t} />
				</React.Fragment>
			));
			break;
		}

		case 'intrinsic': {
			const type = base as JSONOutput.IntrinsicType;
			value = <span className="tsd-signature-type">{type.name}</span>;
			break;
		}

		case 'literal': {
			const type = base as JSONOutput.LiteralType;
			value = <span className="tsd-signature-type">{String(type.value)}</span>;
			break;
		}

		case 'mapped': {
			const type = base as unknown as JSONOutput.MappedType;
			value = (
				<>
					<span className="tsd-signature-symbol">{'{ '}</span>

					{type.readonlyModifier === '+' && <span className="tsd-signature-symbol">readonly </span>}
					{type.readonlyModifier === '-' && (
						<span className="tsd-signature-symbol">-readonly </span>
					)}

					<span className="tsd-signature-symbol">[ </span>
					<span className="tsd-signature-type">{type.parameter}</span>
					<span className="tsd-signature-symbol"> in </span>
					<Type type={type.parameterType} />
					{type.nameType && (
						<>
							<span className="tsd-signature-symbol"> as </span>
							<Type type={type.nameType} />
						</>
					)}
					<span className="tsd-signature-symbol"> ]</span>

					{type.readonlyModifier === '+' && <span className="tsd-signature-symbol">?: </span>}
					{type.readonlyModifier === '-' && <span className="tsd-signature-symbol">-?: </span>}
					{!type.readonlyModifier && <span className="tsd-signature-symbol">: </span>}

					<Type type={type.templateType} />

					<span className="tsd-signature-symbol">{' }'}</span>
				</>
			);
			break;
		}

		case 'optional': {
			const type = base as JSONOutput.OptionalType;
			value = (
				<>
					<Type type={type.elementType} />
					<span className="tsd-signature-symbol">?</span>
				</>
			);
			break;
		}

		case 'predicate': {
			const type = base as JSONOutput.PredicateType;
			value = (
				<>
					{type.asserts && <span className="tsd-signature-symbol">asserts </span>}
					<span className="tsd-signature-type">{type.name}</span>
					{type.targetType && (
						<>
							<span className="tsd-signature-symbol"> is </span>
							<Type type={type.targetType} />
						</>
					)}
				</>
			);
			break;
		}

		case 'query': {
			const type = base as JSONOutput.QueryType;
			value = (
				<>
					<span className="tsd-signature-symbol">typeof </span>
					<Type type={type.queryType} />
				</>
			);
			break;
		}

		case 'reference': {
			const type = base as JSONOutput.ReferenceType;
			const ref = type.id ? reflections[type.id] : null;
			value = (
				<>
					{ref?.permalink ? (
						<Link to={ref.permalink} className="tsd-signature-type" data-tsd-kind={ref.kindString}>
							{type.name}
						</Link>
					) : (
						<span className="tsd-signature-type">{type.name}</span>
					)}
					{type.typeArguments?.length > 0 && (
						<>
							<span className="tsd-signature-symbol">&lt;</span>
							{type.typeArguments.map((t, i) => (
								<React.Fragment key={t.type + i}>
									{i > 0 && <span className="tsd-signature-symbol">, </span>}
									<Type type={t} />
								</React.Fragment>
							))}
							<span className="tsd-signature-symbol">&gt;</span>
						</>
					)}
				</>
			);
			break;
		}

		case 'reflection': {
			const type = base as JSONOutput.ReflectionType;
			const decl = type.declaration;

			// object literal
			if (decl.children?.length > 0) {
				value = (
					<>
						<span className="tsd-signature-symbol">{'{ '}</span>
						{decl.children.map((child, i) => (
							<React.Fragment key={child.id ?? i}>
								{i > 0 && <span className="tsd-signature-symbol">; </span>}
								<span>
									{child.name}
									<span className="tsd-signature-symbol">{child.flags?.isOptional}?: </span>
									{child.type ? <Type type={child.type} /> : 'any'}
								</span>
							</React.Fragment>
						))}
						<span className="tsd-signature-symbol">{' }'}</span>
					</>
				);
			} else if (decl.signatures?.length === 1) {
				value = <MemberSignatureTitle hideName useArrow sig={decl.signatures[0]} />;
			} else if (decl.signatures?.length > 0) {
				value = (
					<>
						<span className="tsd-signature-symbol">{'{ '}</span>
						{decl.signatures.map((sig, i) => (
							<React.Fragment key={sig.id ?? i}>
								{i > 0 && <span className="tsd-signature-symbol">; </span>}
								<MemberSignatureTitle sig={sig} />
							</React.Fragment>
						))}
						<span className="tsd-signature-symbol">{' }'}</span>
					</>
				);
			} else {
				value = '{}';
			}
			break;
		}

		case 'rest': {
			const type = base as JSONOutput.RestType;
			value = (
				<>
					<span className="tsd-signature-symbol">...</span>
					<Type type={type.elementType} />
				</>
			);
			break;
		}

		case 'tuple': {
			const type = base as JSONOutput.TupleType;
			value = (
				<>
					<span className="tsd-signature-symbol">[</span>
					{type.elements.map((t, i) => (
						<React.Fragment key={t.type + i}>
							{i > 0 && <span className="tsd-signature-symbol">, </span>}
							<Type type={t} />
						</React.Fragment>
					))}
					<span className="tsd-signature-symbol">]</span>
				</>
			);
			break;
		}

		case 'typeOperator': {
			const type = base as JSONOutput.TypeOperatorType;
			value = (
				<>
					<span className="tsd-signature-symbol">{type.operator} </span>
					<Type type={type.target} />
				</>
			);
			break;
		}

		case 'typeParameter': {
			const type = base as JSONOutput.TypeParameterType;
			value = <span className="tsd-signature-type">{type.name}</span>;
			break;
		}

		case 'union': {
			const type = base as JSONOutput.UnionType;
			value = type.types.map((t, i) => (
				<React.Fragment key={t.type + i}>
					{i > 0 && <span className="tsd-signature-symbol"> | </span>}
					<Type needsParens={wrapWithParens(t)} type={t} />
				</React.Fragment>
			));
			break;
		}

		case 'unknown': {
			const type = base as JSONOutput.UnknownType;
			value = <span className="tsd-signature-type">{type.name}</span>;
			break;
		}

		case 'named-tuple-member': {
			const type = base as JSONOutput.NamedTupleMemberType;
			value = (
				<>
					{type.name}
					<span className="tsd-signature-symbol">{type.isOptional ? '?: ' : ': '}</span>
					<Type type={type.element} />
				</>
			);
			break;
		}

		case 'template-literal': {
			const type = base as unknown as JSONOutput.TemplateLiteralType;
			value = (
				<>
					<span className="tsd-signature-symbol">`</span>
					{type.head && <span className="tsd-signature-type">{type.head}</span>}
					{type.tail.map((t, i) => (
						<React.Fragment key={i}>
							<span className="tsd-signature-symbol">{'${'}</span>
							{typeof t[0] !== 'string' && <Type type={t[0] as JSONOutput.SomeType} />}
							<span className="tsd-signature-symbol">{'}'}</span>
							{typeof t[1] === 'string' && <span className="tsd-signature-type">{t[1]}</span>}
						</React.Fragment>
					))}
					<span className="tsd-signature-symbol">`</span>
				</>
			);
			break;
		}

		default:
			return <span className="tsd-signature-type">void</span>;
	}

	return (
		<>
			{needsParens && <span className="tsd-signature-symbol">(</span>}
			{value}
			{needsParens && <span className="tsd-signature-symbol">)</span>}
		</>
	);
}
