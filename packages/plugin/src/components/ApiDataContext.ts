import { createContext } from 'react';
import { ApiOptions, DeclarationReflectionMap } from '../types';

export const ApiDataContext = createContext<{
	options: ApiOptions;
	reflections: DeclarationReflectionMap;
}>({
	options: { minimal: false, pluginId: 'default' },
	reflections: {},
});
