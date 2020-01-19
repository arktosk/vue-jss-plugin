<br/>
<p align="center">
  <img src="./logo.svg">
</p>
<h1 align="center">Vue JSS Plugin</h1>
<p align="center">
  <span><img src="https://github.com/arktosk/vue-jss-project/workflows/Verify%20build/badge.svg?branch=master" alt="Build status"/></span>
  <span><img src="https://img.shields.io/npm/v/vue-jss-plugin" alt="@latest released version"/></span>
  <span><img src="https://img.shields.io/badge/vue.js-2.6.x-brightgreen" alt="Vue.js tested version"/></span>
  <span><img src="https://img.shields.io/npm/dm/vue-jss-plugin" alt="Downloads rate"/></span>
  <span><img src="https://img.shields.io/github/license/arktosk/vue-jss-project?color=blue" alt="Licence"/></span>
</p>
<p align="center">
  The Vue JSS plugin implements one of the most flexible CSS-in-JS framework in Vue.js components. About JSS you can read more in the 📖 <a href="https://cssinjs.org">JSS documentation</a>.
</p>

### Table of content

- [Usage](#usage)
- [Installation](#installation)
- [Development](#development)
- [Examples](#examples)
- [Test](#test)
- [Production](#production)
- [License](#license)

## Usage

The plugin usage section was moved to separate file that is published as README file on npm registry. Check README page for your plugin version on npmjs.org [plugin page](https://www.npmjs.com/package/vue-jss-plugin), or go to the latest draft of [package README](./package.md) file and check [Usage section](./package.md#usage)

## Installation

### Environment

Project was initially designed to be run over **Node.js®** 12.14.0 LTS, and that version is locked in `.nvmrc` file. There shouldn't be much troubles to run it on other version, but if there will be any please use [nvm](https://github.com/nvm-sh/nvm) to switch to declared version of **Node.js®**.

```sh
$ nvm install
$ nvm use
```

### Dependencies

The project uses **npm** as a package manager, so use only **npm** to install all project dependencies.

```sh
$ npm install
```

## Development

```sh
$ npm run start
```

## Examples

// TODO

## Tests

The project contains configured eslint setup and test cases driven by jest. Before build should be run to make sure that every feature works well.

```sh
$ npm run lint
$ npm run test
```

## Production

```sh
$ npm run build
```

## License

Released under the MIT [License](./LICENSE). Copyright © 2019-2020 Arkadiusz S. Krauzowicz
