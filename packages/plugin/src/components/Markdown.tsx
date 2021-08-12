import React from 'react';

export interface MarkdownProps {
	content: string;
}

// It's really heavy to transform this at runtime, how should we handle it?
export function Markdown({ content }: MarkdownProps) {
	return <>{content}</>;
}
