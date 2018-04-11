# vue-native-scripts

Compile And Transform Vue component to React Native.

## Install

### Step 1: Install

```
npm install --save vue-native-core vue-native-helper
npm install --save-dev vue-native-scripts
```

### Step 2: Configure the react native packager

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

Create `vueTransformerPlugin.js` file to your project's root and specify supported extensions:

```js
// For React Native version 0.52 or later
var upstreamTransformer = require("metro/src/transformer");

// For React Native version 0.47-0.51
// var upstreamTransformer = require("metro-bundler/src/transformer");

// For React Native version 0.46
// var upstreamTransformer = require("metro-bundler/build/transformer");

var vueNaiveScripts = require("vue-native-scripts");
var vueExtensions = ["vue"]; // <-- Add other extensions if needed.

module.exports.transform = function({ src, filename, options }) {
  if (vueExtensions.some(ext => filename.endsWith("." + ext))) {
    return vueNaiveScripts.transform({ src, filename, options });
  }
  return upstreamTransformer.transform({ src, filename, options });
};
```

## Tips

For react-native packager can not bundle `.vue` file, this scripts just compiled the file with `.vue` suffixed and generated a same name file with `.js` suffixed.

In the react native application, you can simply `import` your Vue components as following

```
import VueComponent from './VueComponent.vue'
```

There should be a file named `VueComponent.vue` in the corresponding folder, and the transformer would be parse this file and send it to the react native packager.
