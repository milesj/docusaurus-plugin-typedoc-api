The `ApiPage` and `ApiItem` components are based on Docusaurus' built-in `DocPage` and `DocItem`. We
wanted to reuse as much code as possible, so we try and extend or duplicate when necessary. Please
reference the classic them when making changes:
https://github.com/facebook/docusaurus/tree/main/packages/docusaurus-theme-classic/src/theme

The remaining components are React based copies of the TypeDoc handlebar templates. We wanted the UI
to feel as similar as possible, so we align our markup as closely as possible to TypeDoc. Please
reference the default theme when making changes:
https://github.com/TypeStrong/typedoc-default-themes/tree/master/src/default
