import '@vscode/codicons/dist/codicon.css';
import React, { useMemo } from 'react';
import { JSONOutput } from 'typedoc';
import DocPage, { Props as DocPageProps } from '@theme/DocPage';
import { DeclarationInfo, DeclarationInfoMap, PackageInfo } from '../types';
import { ApiDataContext } from './ApiDataContext';

function isObject(value: unknown): value is JSONOutput.Reflection {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMapReflections(data: JSONOutput.Reflection, map: DeclarationInfoMap) {
	Object.entries(data).forEach(([key, value]) => {
		if (key === 'id') {
			const hasType = 'type' in data;

			// Dont overwrite with reference nodes
			if (!hasType || (hasType && (data as unknown as { type: string }).type !== 'reference')) {
				// eslint-disable-next-line no-param-reassign
				map[Number(value)] = data as DeclarationInfo;
			}
		} else if (Array.isArray(value)) {
			value.forEach((val) => {
				if (isObject(val)) {
					deepMapReflections(val, map);
				}
			});
		} else if (isObject(value)) {
			deepMapReflections(value, map);
		}
	});

	return map;
}

export interface ApiPageProps extends DocPageProps {
	data: PackageInfo;
}

function ApiPage({ data, ...props }: ApiPageProps) {
	const value = useMemo(() => deepMapReflections(data, {}), [data]);

	return (
		<ApiDataContext.Provider value={value}>
			<DocPage {...props} />
		</ApiDataContext.Provider>
	);
}

export default ApiPage;
