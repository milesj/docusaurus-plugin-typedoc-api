import { useContext } from 'react';
import { ApiDataContext } from '../components/ApiDataContext';
import { DeclarationInfo } from '../types';

export function useDeclaration(id?: number): DeclarationInfo | null {
	const data = useContext(ApiDataContext);

	if (!id) {
		return null;
	}

	if (data[id]) {
		return data[id];
	}

	throw new Error(`Unable to find declaration with ID ${id}`);
}
