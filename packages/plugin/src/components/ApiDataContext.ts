import { createContext } from 'react';
import { ApiOptions, DeclarationReflectionMap } from '../types';

export const ApiDataContext = createContext<{
	options: ApiOptions;
	reflections: DeclarationReflectionMap;
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
