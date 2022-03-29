import { useContext } from 'react';
import type { JSONOutput } from 'typedoc';
import { ApiDataContext } from '../components/ApiDataContext';

export function useReflection<T = JSONOutput.DeclarationReflection>(id?: number): T | null {
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
