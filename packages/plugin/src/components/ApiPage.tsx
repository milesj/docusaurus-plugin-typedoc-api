/* eslint-disable no-param-reassign */

import '@vscode/codicons/dist/codicon.css';
import 'docusaurus-plugin-typedoc-api/styles.css';
import React, { useMemo } from 'react';
import { JSONOutput } from 'typedoc';
import DocPage, { Props as DocPageProps } from '@theme/DocPage';
import { DeclarationReflectionMap } from '../types';
import { ApiDataContext } from './ApiDataContext';

function isObject(value: unknown): value is JSONOutput.Reflection {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMapReflections(
	data: JSONOutput.Reflection,
	map: DeclarationReflectionMap,
	parent?: JSONOutput.Reflection,
) {
	Object.entries(data).forEach(([key, value]) => {
		if (key === 'id') {
			const hasType = 'type' in data;

			// Dont overwrite with reference nodes
			if (!hasType || (hasType && (data as unknown as { type: string }).type !== 'reference')) {
				map[Number(value)] = data;

				if (parent) {
					data.parentId = parent.id;
				}
			}
		} else if (Array.isArray(value)) {
			value.forEach((val) => {
				if (isObject(val)) {
					deepMapReflections(val, map, data);
				}
			});
		} else if (isObject(value)) {
			deepMapReflections(value, map, data);
		}
	});

	return map;
}

export interface ApiPageProps extends DocPageProps {
	data: JSONOutput.ProjectReflection;
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
