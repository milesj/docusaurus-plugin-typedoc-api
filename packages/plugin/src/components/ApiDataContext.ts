import { createContext } from 'react';
import { ApiOptions, DeclarationReflectionMap } from '../types';

export const ApiDataContext = createContext<{
	options: ApiOptions;
	reflections: DeclarationReflectionMap;
}>({
	options: { banner: '', breadcrumbs: true, minimal: false, pluginId: 'default' },
	reflections: {},
});
