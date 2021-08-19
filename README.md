# docusaurus-plugin-typedoc-api

[![Build Status](https://travis-ci.org/milesj/docusaurus-plugin-typedoc-api.svg?branch=master)](https://travis-ci.org/milesj/docusaurus-plugin-typedoc-api)
[![npm version](https://badge.fury.io/js/docusaurus-plugin-typedoc-api.svg)](https://www.npmjs.com/package/docusaurus-plugin-typedoc-api)
[![npm deps](https://david-dm.org/milesj/docusaurus-plugin-typedoc-api.svg?path=packages/plugin)](https://www.npmjs.com/package/docusaurus-plugin-typedoc-api)

A Docusaurus plugin for generating source code `/api/*` routes, powered by
[TypeDoc](https://typedoc.org/).

## Documentation

View the [official readme](./packages/plugin/README.md) for more information on installation and
usage.

## Contributing

Since this repository doesn't have a public API, nor is its source code organized in a way to
utilize TypeDoc, we rely on the types provided by [Boost](https://github.com/milesj/boost). To
contribute, you'll need to clone the Boost project relative to this project as a sibling.

```bash
# Setup plugin
git clone git@github.com:milesj/docusaurus-plugin-typedoc-api.git
cd docusaurus-plugin-typedoc-api
yarn install
yarn run pack

# Setup Boost
cd ..
git clone git@github.com:milesj/boost.git
cd boost
yarn install
yarn run pack
```

After both projects are setup, you can make modifications to this project and then verify the
changes by starting the Docusaurus server with `yarn run docs`. _However_, hot reloading does not
work, so you'll unfortunately need to run this command over and over again...
