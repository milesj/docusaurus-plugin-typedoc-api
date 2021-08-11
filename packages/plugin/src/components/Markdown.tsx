import React from 'react';

export interface MarkdownProps {
	content: string;
}

export function Markdown({ content }: MarkdownProps) {
	return <>{content}</>;
}
