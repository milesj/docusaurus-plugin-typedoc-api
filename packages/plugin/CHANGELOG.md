# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 - 2023-03-26

#### 💥 Breaking

- Drop Node v14 support. Require v16.12+. ([7292bd5](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/7292bd5))

#### 🚀 Updates

- Support TypeScript v5. ([bd78d56](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/bd78d56))

#### 📦 Dependencies

- **[docusaurus]** Update to v2.4. ([3e86908](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/3e86908))
- **[packemon]** Update to v3. ([593bdb4](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/593bdb4))
- **[typedoc]** Update to v0.23.28. ([6654647](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/6654647))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 2.5.1 - 2022-12-14

#### 🐞 Fixes

- Fix monorepos with 1 package not working. (#85) ([72c88f3](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/72c88f3)), closes [#85](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/85)
- Support readme & changelog in polyrepo mode. (#83) ([ff30935](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/ff30935)), closes [#83](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/83) [#82](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/82)

#### 📦 Dependencies

- **[marked]** Update to v4.2.2. ([2c09276](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/2c09276))
- **[moon-dev]** Update to latest. ([ee25e29](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/ee25e29))
- **[typedoc]** Update to v0.23.22. ([db65d7d](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/db65d7d))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 2.5.0 - 2022-11-08

#### 🚀 Updates

- Add sortSidebar setting. ([60a5a69](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/60a5a69))

#### 📦 Dependencies

- **[docusaurus]** Update to v2.2. (#80) ([3627fef](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/3627fef)), closes [#80](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/80)
- **[marked]** Update to v4.2. ([e807225](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/e807225))
- **[typedoc]** Update to v0.23.20. ([34f5b5d](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/34f5b5d))
- Update dev dependencies. ([06eae24](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/06eae24))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 2.4.1 - 2022-09-27

#### 🐞 Fixes

- Disable noIndex. ([1bd0098](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/1bd0098))

#### 📦 Dependencies

- **[docusaurus]** Update to v2.1. ([1fcccd2](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/1fcccd2))
- **[marked]** Update to v4.1. ([bc4cf85](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/bc4cf85))
- **[typedoc]** Update to v0.23.15. ([33aff5c](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/33aff5c))
- **[typescript]** Update to v4.8.3. ([1e9e277](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/1e9e277))

#### 🛠 Internals

- Migrate from beemo to moon. (#74) ([d649407](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/d649407)), closes [#74](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/74)

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 2.4.0 - 2022-08-20

#### 🚀 Updates

- Allow domain/host to be configured in source links. ([531b036](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/531b036))
- Support admonitions in doc blocks. ([5e9bf5a](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/5e9bf5a))

#### 🐞 Fixes

- Configured TypeDoc to recognise `@apilink` and `@doclink` tags (#67) ([c6ba967](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/c6ba967)), closes [#67](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/67) [#64](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/64)
- Fix certain block tags not displaying. ([1ed193e](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/1ed193e))
- Fix readmes/changelogs not rendering code blocks with prism. ([8949cf3](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/8949cf3))
- Render default value with correct type. ([d270901](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/d270901))

#### 📦 Dependencies

- **[packemon]** Update to v2.3.4. ([53b313d](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/53b313d))
- **[typedoc]** Update to v0.23.10. ([e9d25ab](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/e9d25ab))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 2.3.0 - 2022-08-05

#### 🚀 Updates

- Add `sortPackages` option. ([113ea09](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/113ea09))
- Support rendering of [@default](https://github.com/default) values. ([67c4238](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/67c4238))

#### 📦 Dependencies

- **[docusaurus]** Add as a peer dependency. ([1e43d76](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/1e43d76))
- **[docusaurus]** Update to v2.0 official. ([e8ea855](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/e8ea855))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 2.2.1 - 2022-07-20

#### 🐞 Fixes

- Fix 'Duplicate routes found!' warning for polyrepos (#56) ([9b7b285](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/9b7b285)), closes [#56](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/56)
- Fix links/code not rendering correctly in comments. ([5447047](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/5447047))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 2.2.0 - 2022-07-19

#### 🚀 Updates

- alpha beta experimental modifiers (#53) ([f32fa95](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/f32fa95)), closes [#53](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/53)

#### 📦 Dependencies

- **[docusaurus]** Update to rc.1. ([d7538df](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/d7538df))
- **[marked]** Update to v4. ([ef52f60](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/ef52f60))
- **[typedoc]** Update to v0.23.8 (#54) ([44a21dc](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/44a21dc)), closes [#54](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/54)

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 2.1.1 - 2022-07-13

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 2.1.0 - 2022-07-10

#### 🚀 Updates

- Support TypeDoc 0.23 syntax, with transformers for previous syntax. ([2063e3f](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/2063e3f))

#### 📦 Dependencies

- **[beemo-dev]** Update to v2 latest. ([ac12011](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/ac12011))
- **[docusaurus]** Update to beta.22. (#51) ([05395cd](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/05395cd)), closes [#51](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/51)
- **[packemon]** Update to v2.3. ([43a84e4](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/43a84e4))
- **[typedoc]** Update to v0.22.18. ([12c4794](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/12c4794))
- **[typedoc]** Update to v0.23.7. ([aaf4b99](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/aaf4b99))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 2.0.1 - 2022-05-29

#### 🐞 Fixes

- Fix unexpected redirect for next versions. ([4e5e4ae](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/4e5e4ae))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





# 2.0.0 - 2022-05-29

#### 💥 Breaking

- Drop Node.js v12 support. ([7ad6fc8](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/7ad6fc8))

#### 📦 Dependencies

- **[beemo-dev]** Update to v2. ([fefe8f1](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/fefe8f1))
- **[codicons]** Update to v0.30. ([67b0952](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/67b0952))
- **[docusaurus]** Update to beta.21. ([ae39220](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/ae39220))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 1.11.0 - 2022-05-09

#### 🚀 Updates

- Add `gitRefName` option. (#37) ([b73c836](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/b73c836)), closes [#37](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/37) [#36](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/36)
- Add changelogs support. (#40) ([f9a9c8c](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/f9a9c8c)), closes [#40](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/40)
- Add flags to classes. ([90d4eb8](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/90d4eb8))

#### 🐞 Fixes

- [@link](https://github.com/link) and [@apilink](https://github.com/apilink) symbols are now correctly rendered. Closes #34 (#35) ([1b51bc3](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/1b51bc3)), closes [#34](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/34) [#35](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/35)

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([9d5960e](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/9d5960e))
- **[docusaurus]** Update to beta.19. (#41) ([47ee476](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/47ee476)), closes [#41](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/41)
- **[docusaurus]** Update to beta.20. ([e8991a3](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/e8991a3))
- **[typedoc]** Update to v0.22.15. ([1bd2bc1](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/1bd2bc1))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 1.10.0 - 2022-03-29

#### 🚀 Updates

- Add `removeScopes` option. ([301a38a](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/301a38a))
- Support `@apilink` and `@doclink` markdown tokens. ([3378479](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/3378479))

#### 🐞 Fixes

- Truncate with ellipsis instead of break word. ([9adae93](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/9adae93))
- Use MDX image. ([cdae8d9](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/cdae8d9))

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([0f99f57](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/0f99f57))
- **[docusaurus]** Update to beta.18. ([1f9125a](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/1f9125a))
- **[typedoc]** Update to v0.22.13, to support TS 4.6. ([9fa365b](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/9fa365b))

#### 🛠 Internals

- Use type imports. ([a35584f](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/a35584f))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 1.9.0 - 2022-03-04

#### 🚀 Updates

- Support a banner message at the top of the index page. ([c00d7b4](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/c00d7b4))

#### 🐞 Fixes

- Fix anchor fragment being hidden. ([90ee341](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/90ee341))

#### 📦 Dependencies

- **[docusaurus]** Update to beta.17. ([e81c3d1](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/e81c3d1))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 1.8.0 - 2022-02-27

#### 🚀 Updates

- Add breadcrumbs to the top of each page. ([2e3e49f](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/2e3e49f))
- Add option to control breadcrumbs. ([1fab8ef](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/1fab8ef))

#### 🐞 Fixes

- Add fragments for items within namespaces. ([f7cf6b3](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/f7cf6b3))
- Break long entity names. ([e068222](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/e068222))
- Mute generic types. ([9e042f0](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/9e042f0))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.7.2 - 2022-02-25

#### 🐞 Fixes

- Add `@docusaurus/plugin-content-docs` as dependency (#19) ([e90163f](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/e90163f)), closes [#19](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/19)
- Consistently replace `\\` on Windows (#21) ([2dba7d3](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/2dba7d3)), closes [#21](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/21)
- Dont redirect on versions missing a patch. ([e826556](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/e826556))
- Include package name and version when versioning. ([07fb9aa](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/07fb9aa))

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([5b59357](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/5b59357))
- **[docusaurus]** Update to beta.16. (#20) ([a0e3fdd](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/a0e3fdd)), closes [#20](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/20)
- **[packemon]** Update to v1.11. ([e17f6b5](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/e17f6b5))
- **[packemon]** Update to v1.14. ([2ee4a6e](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/2ee4a6e))
- **[typescript]** Update to v4.5 latest. ([b46fdcb](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/b46fdcb))

#### 📘 Docs

- Add comparison. ([bd02fc5](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/bd02fc5))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.7.1 - 2022-01-12

#### 🐞 Fixes

- Fix baseUrl being doubled. ([9c9ffca](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/9c9ffca))
- Fix routes when built on Windows. [#17] ([8a51cc5](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/8a51cc5)), closes [#17](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/17)
- Redirect to preferred version from api index. [#18] ([43d6dd5](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/43d6dd5)), closes [#18](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/18)

#### 📘 Docs

- Add exampel for api version dropdown. ([a5289f1](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/a5289f1))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 1.7.0 - 2021-12-21

#### 🚀 Updates

- Add versioning support. (#16) ([82d9f67](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/82d9f67)), closes [#16](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/16)

#### 📦 Dependencies

- **[docusaurus]** Update to beta.14. ([ab98092](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/ab98092))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.6.2 - 2021-12-18

#### 📦 Dependencies

- **[beemo-dev]** Update to latest configs. ([0f143e8](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/0f143e8))
- **[docusaurus]** Update to beta.13. ([33bfd37](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/33bfd37))
- **[typedoc]** Update to v0.22.10. ([92d6170](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/92d6170))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.6.1 - 2021-11-05

#### 🐞 Fixes

- Support source file paths that are missing the monorepo package folder. ([88b29b5](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/88b29b5))

#### 📦 Dependencies

- **[docusaurus]** Update to beta.9. ([547ad6e](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/547ad6e))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 1.6.0 - 2021-10-31

#### 🚀 Updates

- Support `@link` tokens in markdown. (#12) ([54b05b8](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/54b05b8)), closes [#12](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/12)

#### 🐞 Fixes

- Fallback path if empty. ([48e56ae](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/48e56ae))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.5.1 - 2021-10-25

#### 🐞 Fixes

- Fix package path/slug detection. ([6f9468c](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/6f9468c))
- Fix previous link resolving to an invalid ID. ([20da81e](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/20da81e))
- Fix some markdown rendering issues. ([41046c4](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/41046c4))

#### ⚙️ Types

- Fix docusaurus types. ([403b091](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/403b091))

#### 📦 Dependencies

- **[docusaurus]** Update to beta.8. ([7f9d1b7](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/7f9d1b7))
- **[marked]** Update to v3. ([2a86bbf](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/2a86bbf))
- **[typedoc]** Update to v0.22.7. ([d0b7a56](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/d0b7a56))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 1.5.0 - 2021-10-16

#### 🚀 Updates

- Add options to customize package.json and readme file names. ([1c2fd4b](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/1c2fd4b))

#### 📦 Dependencies

- **[docusaurus]** Update requirement to beta.7. ([6e7cf9d](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/6e7cf9d))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 1.4.0 - 2021-10-11

#### 🚀 Updates

- Flatten sidebar when only 1 package. ([a9c16d0](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/a9c16d0))
- Redirect to package from index when only 1. ([639c23b](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/639c23b))
- Support baseUrl for all routes. ([c0e341b](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/c0e341b))

#### 📦 Dependencies

- **[typedoc]** Update to v0.22.5. ([b1fc654](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/b1fc654))
- Update codicons. ([2be3498](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/2be3498))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.3.2 - 2021-09-23

#### 🐞 Fixes

- Fix CJS/ESM import interop issues. ([332eb53](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/332eb53))

#### 📦 Dependencies

- Update to latest. ([914003d](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/914003d))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.3.1 - 2021-09-13

#### 🐞 Fixes

- Fix custom url slug not passing through. ([71611bf](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/71611bf))

#### 📦 Dependencies

- **[typedoc]** Update to v0.22. ([65e1afe](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/65e1afe))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 1.3.0 - 2021-09-08

#### 🚀 Updates

- Add support for polyrepos. (#5) ([e335e31](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/e335e31)), closes [#5](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/5)

#### 🐞 Fixes

- Update icons to be inline block. ([116cf41](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/116cf41))

#### 📦 Dependencies

- Update requirement to beta.6. ([490a4db](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/490a4db))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.2.1 - 2021-09-01

#### 🐞 Fixes

- Use typescript to parse config files. ([825376f](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/825376f))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 1.2.0 - 2021-08-25

#### 🚀 Updates

- Allow some TypeDoc options to be defined. ([389be6f](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/389be6f))
- Improve local cache strategy. ([6eeba5c](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/6eeba5c))
- Support packages that utilize deep imports. (#3) ([76b4fa4](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/76b4fa4)), closes [#3](https://github.com/milesj/docusaurus-plugin-typedoc-api/issues/3)

#### 🐞 Fixes

- Only enable emit when using project references. ([323be13](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/323be13))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





## 1.1.0 - 2021-08-22

#### 🚀 Updates

- Add debug and tsconfigName options. ([289b567](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/289b567))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.0.1 - 2021-08-22

#### 🐞 Fixes

- Add missing divider. ([c75e255](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/c75e255))
- Cleanup docblock tags. ([214ad2b](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/214ad2b))
- Fix markdown lists not rendering correctly. ([7befcbd](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/7befcbd))
- Fix mislabeled index entry point. ([3c60f17](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/3c60f17))

#### 📘 Docs

- Update changelog. ([1e0fdcc](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/1e0fdcc))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





# 1.0.0 - 2021-08-20

#### 🎉 Release

- Initial release!

#### 🚀 Updates

- Add footer to all routes. ([c2c875c](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/c2c875c))

#### 🐞 Fixes

- Fix API index route handling. ([4517ce8](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/4517ce8))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.0.0-alpha.6 - 2021-08-19

#### 🐞 Fixes

- Dont dynamic import marked. ([84c4e5c](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/84c4e5c))
- Use smart markdown lists. ([44eb720](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/44eb720))

#### 📦 Dependencies

- Update to latest. ([33681ac](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/33681ac))

#### 📘 Docs

- Add note about broken links. ([9f53216](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/9f53216))
- Update readmes. ([272ae50](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/272ae50))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.0.0-alpha.5 - 2021-08-18

#### 🐞 Fixes

- Cache TypeDoc file by date. ([4c69ff2](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/4c69ff2))
- Dont show divider if no following content. ([6f3aff0](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/6f3aff0))
- Fix cache year timestamp. ([ba5403f](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/ba5403f))
- Improve sig body detection. ([26d09ad](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/26d09ad))
- Update icons and colors. ([3b4ccd5](https://github.com/milesj/docusaurus-plugin-typedoc-api/commit/3b4ccd5))

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.0.0-alpha.4 - 2021-08-18

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.0.0-alpha.3 - 2021-08-14

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.0.0-alpha.2 - 2021-08-12

**Note:** Version bump only for package docusaurus-plugin-typedoc-api





### 1.0.0-alpha.1 - 2021-08-12

**Note:** Version bump only for package docusaurus-plugin-typedoc-api
