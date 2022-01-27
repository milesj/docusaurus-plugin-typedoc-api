import { join } from 'path';

export function joinUrl(...paths: string[]): string {
	return join(...paths).replace(/\\/g, '/');
}
