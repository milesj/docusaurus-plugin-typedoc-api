export default {
	rules: {
		// Our components rely on a ton of composition
		'react/jsx-no-literals': 'off',
		'react/jsx-no-useless-fragment': 'off',

		// We refernce TypeDoc kind numbers
		'no-magic-numbers': 'off',

		// All the docusaurus types dont resolve
		'import/no-unresolved': 'off',

		// Docusaurus requires default exported components
		'import/no-default-export': 'off',

		// We import from the default theme but its not a dep
		'import/no-extraneous-dependencies': 'off',

		// We import CSS modules that are any
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
	},
};
