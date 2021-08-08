import { createContext } from 'react';
import { DeclarationReflectionMap } from '../types';

export const ApiDataContext = createContext<DeclarationReflectionMap>({});
