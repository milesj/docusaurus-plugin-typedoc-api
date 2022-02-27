import { useContext } from 'react';
import { ApiDataContext } from '../components/ApiDataContext';

export function useBreadcrumbs(): boolean {
	return useContext(ApiDataContext).options.breadcrumbs;
}
