import { useContext } from 'react';
import { ApiDataContext } from '../components/ApiDataContext';

export function useMinimalLayout(): boolean {
	return useContext(ApiDataContext).options.minimal;
}
