export function removeScopes(text: string, scopes: string[]): string {
	if (scopes.length === 0) {
		return text;
	}

	return scopes.reduce(
		(value, scope) => value.replace(new RegExp(`^(${scope}-|@${scope}/)`), ''),
		text,
	);
}
