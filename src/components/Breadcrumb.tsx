// https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/breadcrumb.hbs

import React from 'react';
import { JSONOutput } from 'typedoc';

export interface BreadcrumbProps {
	reflection: JSONOutput.Reflection;
}

export function Breadcrumb({ reflection }: BreadcrumbProps) {
	// TODO parent, url
	return null;
}
