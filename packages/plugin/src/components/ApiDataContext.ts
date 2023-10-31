import { createContext } from 'react';
import type { ApiOptions, TSDDeclarationReflectionMap } from '../types';

export const ApiDataContext = createContext<{
	options: ApiOptions;
	reflections: TSDDeclarationReflectionMap;
}>({
	options: {
		banner: '',
		breadcrumbs: true,
		gitRefName: 'master',
		minimal: false,
		pluginId: 'default',
		scopes: [],
	},
	reflections: {},
});
