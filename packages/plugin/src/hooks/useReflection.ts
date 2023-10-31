import { useContext } from 'react';
import { ApiDataContext } from '../components/ApiDataContext';
import type { TSDDeclarationReflection } from '../types';

export function useReflection<T = TSDDeclarationReflection>(id?: number): T | null {
	const { reflections } = useContext(ApiDataContext);

	// 0 is a valid ID
	if (id === undefined) {
		return null;
	}

	if (reflections[id]) {
		return reflections[id] as unknown as T;
	}

	throw new Error(`Unable to find declaration with ID ${id}`);
}
