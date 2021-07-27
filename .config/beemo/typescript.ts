export default {
	compilerOptions: {
		declaration: true,
		declarationDir: 'dts',
		outDir: 'dts',
		rootDir: 'src',
		emitDeclarationOnly: true,
	},
	include: [
		"src/**/*",
		"types/**/*"
	],
};
