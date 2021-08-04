import React from 'react';
import { JSONOutput } from 'typedoc';
import DocPage, { Props as DocPageProps } from '@theme/DocPage';

export interface ApiPageProps extends DocPageProps {
	data: JSONOutput.DeclarationReflection;
}

function ApiPage({ data, ...props }: ApiPageProps) {
	console.log('ApiPage', data, props);

	return <DocPage {...props}>{'test'}</DocPage>;
}

export default ApiPage;
