// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.reference.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';
import { useReflection } from '../hooks/useReflection';

export interface MemberReferenceProps {
	ref: JSONOutput.ReferenceReflection;
}

// TODO deep links
export function MemberReference({ ref }: MemberReferenceProps) {
	const reflection = useReflection(ref.target || ref.id);

	if (!reflection) {
		return null;
	}

	return <>Re-exports {ref.name}</>;
}
