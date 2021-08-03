// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.signatures.hbs
// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.signature.title.hbs
// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.signature.body.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { Comment } from './Comment';
import { Markdown } from './Markdown';
import { Type } from './Type';
import { TypeParameters } from './TypeParameters';

export interface MemberSignatureTitleProps {
	sig: JSONOutput.SignatureReflection;
}

export function MemberSignatureTitle({ sig }: MemberSignatureTitleProps) {
	return (
		<>
			{sig.kindString === 'Constructor signature' && (
				<>
					{sig.flags.isAbstract && <span className="tsd-signature-symbol">abstract </span>}
					<span className="tsd-signature-symbol">new </span>
				</>
			)}

			{sig.typeParameter && (
				<span>&lt;{sig.typeParameter.map((param) => param.name).join(', ')}&gt;</span>
			)}

			<span className="tsd-signature-symbol">(</span>

			{sig.parameters?.map((param, index) => (
				<>
					{index > 0 && ', '}
					<span>
						{param.flags.isRest && <span className="tsd-signature-symbol">...</span>}
						{param.name}
						<span className="tsd-signature-symbol">
							{(param.flags.isOptional || 'defaultValue' in param) && '?'}
							{': '}
						</span>
						<Type type={param.type} />
					</span>
				</>
			))}

			<span className="tsd-signature-symbol">)</span>

			{sig.type && (
				<>
					<span className="tsd-signature-symbol"> =&gt; </span>
					<Type type={sig.type} />
				</>
			)}
		</>
	);
}

export interface MemberSignatureBodyProps {
	sig: JSONOutput.SignatureReflection;
}

export function MemberSignatureBody({ sig }: MemberSignatureBodyProps) {
	return (
		<>
			{'TODO sources'}

			<Comment comment={sig.comment} />

			{sig.typeParameter && <TypeParameters params={sig.typeParameter} />}

			{sig.parameters && (
				<>
					<h4 className="tsd-parameters-title">Parameters</h4>
					<ul className="tsd-parameters">
						{sig.parameters.map((param) => (
							<li>
								<h5>
									{[...param.flags].map((flag) => (
										<span className="tsd-flag ts-flag{flag}">{flag}</span>
									))}

									{param.flags.isRest && <span className="tsd-signature-symbol">...</span>}

									{`${param.name}: `}

									<Type type={param.type} />

									{'defaultValue' in param && (
										<span className="tsd-signature-symbol"> = {param.defaultValue}</span>
									)}
								</h5>

								<Comment comment={param.comment} />

								{'TODO declaration'}
							</li>
						))}
					</ul>
				</>
			)}

			{sig.type && (
				<>
					<h4 className="tsd-returns-title">
						Returns <Type type={sig.type} />
					</h4>

					{sig.comment?.returns && <Markdown content={sig.comment.returns} />}

					{'TODO declaration'}
				</>
			)}
		</>
	);
}

export interface MemberSignaturesProps {
	sigs: JSONOutput.SignatureReflection[];
}

export function MemberSignatures({ sigs }: MemberSignaturesProps) {
	console.log('MemberSignatures', sigs);

	// TODO cssClasses
	return (
		<>
			<ul className="tsd-signatures {{cssClasses}}">
				{sigs.map((sig) => (
					<li className="tsd-signature tsd-kind-icon">
						<MemberSignatureTitle sig={sig} />
					</li>
				))}
			</ul>

			<ul className="tsd-descriptions">
				{sigs.map((sig) => (
					<li className="tsd-description">
						<MemberSignatureBody sig={sig} />
					</li>
				))}
			</ul>
		</>
	);
}
