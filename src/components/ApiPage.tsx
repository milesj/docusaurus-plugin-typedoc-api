import '@vscode/codicons/dist/codicon.css';
import React, { useMemo } from 'react';
import DocPage, { Props as DocPageProps } from '@theme/DocPage';
import { DeclarationInfoMap, PackageInfo } from '../types';
import { ApiDataContext } from './ApiDataContext';

export interface ApiPageProps extends DocPageProps {
	data: PackageInfo;
}

function ApiPage({ data, ...props }: ApiPageProps) {
	const value = useMemo(() => {
		const map: DeclarationInfoMap = {
			[data.id]: data,
		};

		data.children?.forEach((item) => {
			map[item.id] = item;
		});

		return map;
	}, [data]);

	return (
		<ApiDataContext.Provider value={value}>
			<DocPage {...props} />
		</ApiDataContext.Provider>
	);
}

export default ApiPage;
