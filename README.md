## ⚠️ This project has been deprecated and is no longer maintained ⚠️

# Vue Native

[![No Maintenance Intended](https://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

Visit our website at [vue-native.io](https://vue-native.io) or read the official documentation [here](https://vue-native.io/docs/installation.html).

## Build native mobile apps using Vue

Vue Native is a framework to build cross platform native mobile apps using JavaScript. It is a wrapper around the APIs of React Native. So, with Vue Native, you can do everything that you can do with React Native. With Vue Native, you get

- **The simplicity of Vue.js.** Incrementally build user interfaces with the familiar syntax of HTML and CSS in single file components.
- **Seamless interop with React Native.** Use core React Native components with Vue.js syntax out of the box to develop mobile apps on both iOS and Android.

## Contents
- [Documentation](#documentation)
- [Installation](#installation)
- [Project setup with Vue Native CLI](#project-setup-with-vue-native-cli)
- [Using Vue Native with a pre-existing React Native or Expo project](#using-vue-native-in-a-react-native-project)
- [Available React Native components](#available-react-native-components)
- [Contributors](#contributors)
- [License](#license)
- [Special thanks](#credits-to-react-vue)

## Documentation

You can find the full documentation for Vue Native [on this website](https://vue-native.io/docs/installation.html). It covers installation and setup, component basics, routing, testing, the internal API and more.

The source for the Vue Native documentation and website is hosted on a separate repo, [here](https://github.com/GeekyAnts/vue-native-website)

## Installation

To install Vue Native's official CLI, run
```
$ npm install vue-native-cli -g
```

To use the CLI, you must have either [expo-cli](https://github.com/expo/expo-cli) or [react-native-cli](https://github.com/react-native-community/cli) installed globally.

## Project setup with Vue Native CLI

The Vue Native CLI can be used to easily generate a fully configured Vue Native app. It wraps `expo-cli` and `react-native-cli` to generate a simple single page application (SPA) after installing and configuring dependencies from [vue-native-core](https://github.com/GeekyAnts/vue-native-core).

You should have either expo-cli or react-native-cli installed as a global dependency. Refer to the [installation guide](https://vue-native.io/docs/installation.html) for details on project setup. The GitHub repository for Vue Native CLI is hosted [here](https://github.com/GeekyAnts/vue-native-cli).

With the CLI, generating a Vue Native project is as easy as running the command
```
$ vue-native init <projectName>
```

## Using Vue Native in a React Native project

It is possible to integrate Vue Native into a pre-existing React Native project. You can find instructions to do this [here](converting-react-native-project.md).

These instructions can also be used to set up a Vue Native project from scratch.

## Available React Native components

All the core components of React Native 0.63 onwards are globally registered and available to use in templates without the need to import and locally register.

[The components and their React Native documentation can be found here.](https://reactnative.dev/docs/components-and-apis)

All other components that were previously available, but then deprecated from React Native can still be used by installing their respective packages.

For example, to use `WebView`, use the [react-native-webview](https://github.com/react-native-webview/react-native-webview) package.

## Contributors

This project exists thanks to all the people who contribute. 
<a href="https://github.com/GeekyAnts/vue-native-core/contributors"><img src="https://opencollective.com/vue-native-core/contributors.svg?width=890&button=false" /></a>

## License

[MIT](http://opensource.org/licenses/MIT)

## Credits to [react-vue](https://github.com/SmallComfort/react-vue)

A huge thanks to the author of react-vue for most of the work on Vue Native.
