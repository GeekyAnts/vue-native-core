## Setting up a React Native project for Vue Native

[Vue Native CLI](https://github.com/GeekyAnts/vue-native-cli) is the recommended way to setup a new Vue Native project. However, if you wish to setup a project from scratch, use the following steps after setting up a React Native / Expo project.

### Step 1: Install

The following packages are required as runtime dependencies by Vue Native:
- [vue-native-core](https://www.npmjs.com/package/vue-native-core)
- [vue-native-helper](https://www.npmjs.com/package/vue-native-helper)

During development, another package is required to transpile Vue Native component files (with `.vue` extensions) into JS:
- [vue-native-scripts](https://www.npmjs.com/package/vue-native-scripts)

To install them, run the following commands in your project directory
```
$ npm install --save vue-native-core vue-native-helper
$ npm install --save-dev vue-native-scripts
```

### Step 2: Configure the React Native bundler

The Metro bundler is used by React Native to generate app bundles. It can be configured using a `metro.config.js` file. Add the following to your `metro.config.js` (make one to your project's root if you don't have one already):

```js
const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts }
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve("./vueTransformerPlugin.js"),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      })
    },
    resolver: {
      sourceExts: [...sourceExts, "vue"]
    }
  };
})();
```

#### NOTE to Expo users:

The `app.json` file must be modified to allow `.vue` files to be recognised.

```diff
{
  "expo": {
    "sdkVersion": "34.0.0",
    "platforms": [
      "ios",
      "android",
      "web"
    ],
    ...
    "packagerOpts": {
+     "sourceExts": ["js", "json", "ts", "tsx", "vue"],
      "config": "metro.config.js"
    }
  }
}
```


The `babelTransformPath` property above takes the path to the transformer you wish to use. In our case, we need to create a `vueTransformerPlugin.js` file to the project's root and specify supported extensions:

```js
const vueNativeScripts = require("vue-native-scripts");

const upstreamTransformer = require("metro-react-native-babel-transformer");

const vueExtensions = ["vue"]; // <-- Add other extensions if needed.

module.exports.transform = function ({ src, filename, options }) {
  if (vueExtensions.some(ext => filename.endsWith("." + ext))) {
    return vueNativeScripts.transform({ src, filename, options });
  }
  return upstreamTransformer.transform({ src, filename, options });
};
```

This file conditionally transforms files based on their extensions. `vue-native-scripts` is used for `.vue` files, while the stock React Native Babel transformer is used for other (JS) files.

## Using Vue Native components and `.vue` files

In the React Native application, you can simply `import` your Vue components as follows

```
import VueComponent from './VueComponent.vue'
```

There should be a file named `VueComponent.vue` in the corresponding folder; the transformer parses this file and sends it to the React Native bundler.
