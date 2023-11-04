export function escapeMdx(value: string): string {
	// New values are unicode!
	return value.replace('<', '＜').replace('>', '＞');
}
