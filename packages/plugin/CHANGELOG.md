# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
