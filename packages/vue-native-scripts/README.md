# react-vue-native-scripts

Compile Vue component to React Native.

## Install
```
npm install --save react-vue react-vue-helper
npm install --save-dev react-vue-native-scripts
```

## Usage

> Before you should get a [React Native Application](https://github.com/react-community/create-react-native-app)

Add scripts commands in your `package.json`.

```
...

"scripts": {
  "compiler": "react-vue-native-scripts compiler",
},

...
```

#### cli
```
npm run compiler
```

## Tips

For react-native packager can not bundle `.vue` file, this scripts just compiled the file with `.vue` suffixed and generated a same name file with `.js` suffixed.

In the react native application, you can simply `import` your Vue components as following

```
import VueComponent from './VueComponent'
``` 

There should be a file named `VueComponent.vue` in the corresponding folder, and the compiler would be generate a file named `VueComponent.js` in the same directory.

In react-native packager, `import VueComponent from './VueComponent'` equal to `import VueComponent from './VueComponent.js'`.

[demo]()
