import { createContext } from 'react';
import { DeclarationInfoMap } from '../types';

export const ApiDataContext = createContext<DeclarationInfoMap>({});
