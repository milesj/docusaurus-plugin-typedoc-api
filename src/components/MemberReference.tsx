// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/member.reference.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';

export interface MemberReferenceProps {
	ref: JSONOutput.ReferenceReflection;
}

export function MemberReference({ ref }: MemberReferenceProps) {
	// TODO deep links

	return <>Re-exports {ref.name}</>;
}
