/* eslint-disable no-param-reassign */

import '@vscode/codicons/dist/codicon.css';
import './styles.css';
import { useMemo } from 'react';
import DocRoot, { type Props as DocRootProps } from '@theme/DocRoot';
import type {
	ApiOptions,
	PackageReflectionGroup,
	TSDDeclarationReflection,
	TSDDeclarationReflectionMap,
	TSDReflection,
} from '../types';
import { ApiDataContext } from './ApiDataContext';

function isObject(value: unknown): value is TSDReflection {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMapReflections(
	data: TSDReflection,
	map: TSDDeclarationReflectionMap,
	parent?: TSDReflection,
) {
	Object.entries(data).forEach(([key, value]) => {
		if (key === 'id') {
			const hasType = 'type' in data;

			// Dont overwrite with reference nodes
			if (!hasType || (hasType && (data as unknown as { type: string }).type !== 'reference')) {
				map[Number(value)] = data as TSDDeclarationReflection;

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

function mapPackagesToReflection(packages: PackageReflectionGroup[]): TSDDeclarationReflectionMap {
	const map: TSDDeclarationReflectionMap = {};

	packages.forEach((pkg) => {
		pkg.entryPoints.forEach((entry) => {
			deepMapReflections(entry.reflection, map);
		});
	});

	return map;
}

export interface ApiPageProps extends DocRootProps {
	options: ApiOptions;
	packages: PackageReflectionGroup[];
}

function ApiPage({ options, packages, ...props }: ApiPageProps) {
	const value = useMemo(
		() => ({ options, reflections: mapPackagesToReflection(packages) }),
		[options, packages],
	);

	return (
		<ApiDataContext.Provider value={value}>
			<div className="apiPage">
				<DocRoot {...props} />
			</div>
		</ApiDataContext.Provider>
	);
}

export default ApiPage;
