/* eslint-disable @typescript-eslint/no-use-before-define */
// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/Parameter.hbs

import React from 'react';
import type { JSONOutput } from 'typedoc';
import { useMinimalLayout } from '../hooks/useMinimalLayout';
import { Comment } from './Comment';
import { Flags } from './Flags';
import { Icon } from './Icon';
import { hasSigBody, MemberSignatureBody } from './MemberSignatureBody';
import { MemberSignatures } from './MemberSignatures';
import { MemberSignatureTitle } from './MemberSignatureTitle';
import { Type } from './Type';

export interface ParameterProps {
	param?: JSONOutput.DeclarationReflection;
}

function ParameterChild({ param }: ParameterProps) {
	if (!param) {
		return null;
	}

	if (param.signatures && param.signatures.length > 0) {
		return (
			<li className="tsd-parameter">
				<h5>
					{param.flags?.isRest && <span className="tsd-signature-symbol">...</span>}
					{param.name}
					<span className="tsd-signature-symbol">{param.flags?.isOptional && '?'}: </span>
					function
				</h5>

				<MemberSignatures sigs={param.signatures} />
			</li>
		);
	}

	if (param.type) {
		return (
			<li className="tsd-parameter">
				<h5>
					<Flags flags={param.flags} />
					{param.flags?.isRest && <span className="tsd-signature-symbol">...</span>}
					{param.name}
					<span className="tsd-signature-symbol">{param.flags?.isOptional && '?'}: </span>
					<Type type={param.type} />
				</h5>

				<Comment comment={param.comment} />

				{param.children?.map((child) => (
					<Parameter key={child.id} param={child} />
				))}

				<Parameter param={param.type.declaration} />
			</li>
		);
	}

	const getter = param.getSignature;
	const setter = param.setSignature;

	return (
		<>
			{getter && (
				<li className="tsd-parameter">
					<h5>
						<Flags flags={getter.flags} />
						<span className="tsd-signature-symbol">get </span>
						{getter.name}
						<span className="tsd-signature-symbol">(): </span>
						<Type type={getter.type} />
					</h5>

					<Comment comment={getter.comment} />
				</li>
			)}

			{setter && (
				<li className="tsd-parameter">
					<h5>
						<Flags flags={setter.flags} />
						<span className="tsd-signature-symbol">set </span>
						{setter.name}
						<span className="tsd-signature-symbol">(</span>
						{setter.parameters?.map((p, i) => (
							<span key={p.id}>
								{i > 0 && ', '}
								{p.name}
								<span className="tsd-signature-symbol">: </span>
								{p.type ? <Type type={p.type} /> : 'any'}
							</span>
						))}
						<span className="tsd-signature-symbol">): </span>
						<Type type={setter.type} />
					</h5>

					<Comment comment={setter.comment} />
				</li>
			)}
		</>
	);
}

export function Parameter({ param }: ParameterProps) {
	const minimal = useMinimalLayout();

	if (!param || minimal) {
		return null;
	}

	const hasSomeBody = param.signatures?.some((sig) => hasSigBody(sig, minimal, true));

	return (
		<ul className="tsd-parameters">
			{param.signatures && param.signatures.length > 0 && (
				<li className="tsd-parameter-signature">
					<ul className="tsd-signatures">
						{param.signatures.map((sig) => (
							<li key={sig.id} className="tsd-signature tsd-kind-icon">
								<Icon reflection={sig} />
								<MemberSignatureTitle hideName sig={sig} />
							</li>
						))}
					</ul>

					{hasSomeBody && (
						<ul className="tsd-descriptions">
							{param.signatures.map((sig) => (
								<li key={sig.id} className="tsd-description">
									<MemberSignatureBody hideSources sig={sig} />
								</li>
							))}
						</ul>
					)}
				</li>
			)}

			{param.indexSignature && (
				<li className="tsd-parameter-index-signature">
					<h5>
						<span className="tsd-signature-symbol">[</span>
						{param.indexSignature.parameters?.map((p) => (
							<span key={p.id}>
								{p.flags?.isRest && <span className="tsd-signature-symbol">...</span>}
								{p.name} <Type type={p.type} />
							</span>
						))}
						<span className="tsd-signature-symbol">]: </span>
						<Type type={param.indexSignature.type} />
					</h5>

					<Comment comment={param.indexSignature.comment} />

					<Parameter param={param.indexSignature.declaration} />
				</li>
			)}

			{param.children?.map((child) => (
				<ParameterChild key={child.id} param={child} />
			))}
		</ul>
	);
}
