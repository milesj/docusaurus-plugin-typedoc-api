import { useContext } from 'react';
import { ApiDataContext } from '../components/ApiDataContext';
import type { TSDDeclarationReflection } from '../types';

export function useReflection<T = TSDDeclarationReflection>(
	id?: number,
	required?: boolean,
): T | null {
	const { reflections } = useContext(ApiDataContext);

	// 0 is a valid ID
	if (id === undefined && !required) {
		return null;
	}

	if (id !== undefined && reflections[id]) {
		return reflections[id] as unknown as T;
	}

	throw new Error(`Unable to find declaration with ID ${id}`);
}

export function useRequiredReflection<T = TSDDeclarationReflection>(id?: number): T {
	return useReflection<T>(id, true) as unknown as T;
}
