/* eslint-disable no-param-reassign */

import '@vscode/codicons/dist/codicon.css';
import 'docusaurus-plugin-typedoc-api/styles.css';
import React, { useMemo } from 'react';
import { JSONOutput } from 'typedoc';
import DocPage, { Props as DocPageProps } from '@theme/DocPage';
import { DeclarationReflectionMap } from '../types';
import { ApiDataContext } from './ApiDataContext';
import ApiIndex from './ApiIndex';

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

function mapPackagesToReflection(
	packages: JSONOutput.ProjectReflection[],
): DeclarationReflectionMap {
	const map: DeclarationReflectionMap = {};

	packages.forEach((pkg) => {
		deepMapReflections(pkg, map);
	});

	return map;
}

export interface ApiPageProps extends DocPageProps {
	packages: JSONOutput.ProjectReflection[];
}

function ApiPage({ packages, ...props }: ApiPageProps) {
	const value = useMemo(() => mapPackagesToReflection(packages), [packages]);

	// Define an index here instead of the plugin
	props.route.routes.push({
		// eslint-disable-next-line react/no-unstable-nested-components
		component: () => <ApiIndex packages={packages} />,
		exact: true,
		path: '/api',
		sidebar: 'api',
	});

	return (
		<ApiDataContext.Provider value={value}>
			<DocPage {...props} />
		</ApiDataContext.Provider>
	);
}

export default ApiPage;
