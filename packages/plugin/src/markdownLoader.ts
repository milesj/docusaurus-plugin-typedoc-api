type Callback = (error: Error | null, result: string) => unknown;

export default function markdownLoader(this: { async: () => Callback }, markdown: string) {
	const resolve = this.async();

	// Remove the #/h1 titles as we handle it within our templates
	const markdownWithoutTitle = markdown.replace(/^#\s+([^\n]+)/i, '');

	return resolve?.(null, markdownWithoutTitle);
}
