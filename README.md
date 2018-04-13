# Vue-Native-Core

## This is fork of [react-vue](https://github.com/GeekyAnts/vue-native-core)

Vue-native-core is designed to connect React and Vue, which help you run Vue in React.

There are three uses.

* Use the [reactivity system](#reactivity-system) of Vue to observer React component
* Use the [vue-native-scripts](#vue-native-scripts) to run Vue component in React Native
* Use the [vue-native-cli](#vue-native-cli) to generate a Vue Native App

### Reactivity System

Thanks to Vue's clear hierarchical design, we can easily pull out the reactivity system (9 KB gzipped), and drive React component rendering.

```
npm install --save vue-native-core
```

```javascript
import React, { Component } from "react";
import Vue, { observer } from "vue-native-core";

const store = new Vue({
  data() {
    return {
      count: 0
    };
  },
  methods: {
    increase() {
      this.count++;
    }
  }
});

@observer
export default class Demo extends Component {
  render() {
    return <h1 onClick={store.increase}>{store.count}</h1>;
  }
}
```

[document](https://github.com/GeekyAnts/vue-native-core/blob/master/packages/vue-native-core/README.md)

### Vue Native Scripts

Introduce [vue-native-scripts](https://github.com/GeekyAnts/vue-native-core/tree/master/packages/vue-native-scripts), which compile and transform the vue component into a react component.

## Installation Steps

### Step 1: Install

```
npm install --save vue-native-core vue-native-helper
npm install --save-dev vue-native-scripts
```

### Step 2: Configure the React Native Packager

Create `vueTransformerPlugin.js` file to your project's root and specify supported extensions(vue):

```js
// For React Native version 0.52 or later
var upstreamTransformer = require("metro/src/transformer");

// For React Native version 0.47-0.51
// var upstreamTransformer = require("metro-bundler/src/transformer");

// For React Native version 0.46
// var upstreamTransformer = require("metro-bundler/build/transformer");

var vueNaiveScripts = require("vue-native-scripts");
var vueExtensions = ["vue"];

module.exports.transform = function({ src, filename, options }) {
  if (vueExtensions.some(ext => filename.endsWith("." + ext))) {
    return vueNaiveScripts.transform({ src, filename, options });
  }
  return upstreamTransformer.transform({ src, filename, options });
};
```

Add this to your `rn-cli.config.js` (make one to your project's root if you don't have one already):

```js
module.exports = {
  getTransformModulePath() {
    return require.resolve("./vueTransformerPlugin.js");
  },
  getSourceExts() {
    return ["vue"];
  }
};
```

### Note

All [React Native Components](https://facebook.github.io/react-native/docs/view.html) exists as built-in components in Vue, you can use react native components as following

```html
<template>
  <view>
    <view>
      <text>Hello react vue</text>
    </view>
    <animated:view>
      <text>Hello animation</text>
    </animated:view>
  </view>
</template>
```

The similar JSX code is as follows

```javascript
import React, { Component } from "react";
import { View, Text, Animated } from "react-native";

export default class Demo extends Component {
  render() {
    return (
      <View>
        <View>
          <Text>Hello react native</Text>
        </View>
        <Animated.View>
          <Text>Hello animation</Text>
        </Animated.View>
      </View>
    );
  }
}
```

> You can use all the [React Native API](https://facebook.github.io/react-native/) in Vue component. The camelCased prop names need to use their kebab-case (hyphen-delimited) equivalents

[document](https://github.com/GeekyAnts/vue-native-core/blob/master/packages/vue-native-core/COMPONENT.md)

### Vue Native Cli

> Vue Native Cli is use to generate a `Vue Native` app, which is a wrapper around the APIs of React Native. So, with Vue Native, you can do everything what you can do with React Native.

> Vue Native cli that generates a simple 1 page application with [create-react-native-app](https://github.com/react-community/create-react-native-app),
> [vue-native-core](https://github.com/GeekyAnts/vue-native-core)

## Installation:

```
$ npm install -g vue-native-cli
```

Generate [CRNA + Vue App](https://github.com/GeekyAnts/vue-native-core) App

```
$ vue-native init <projectName>
```

## License

[MIT](http://opensource.org/licenses/MIT)
