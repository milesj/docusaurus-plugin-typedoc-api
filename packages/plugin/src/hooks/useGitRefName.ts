import { useContext } from 'react';
import { ApiDataContext } from '../components/ApiDataContext';

export function useGitRefName(): string {
	return useContext(ApiDataContext).options.gitRefName;
}
