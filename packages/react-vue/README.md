# react-vue.js

A fork of Vue, only modifies very litter code, extracts its reactivity core, and adds an observer function.

## Install
```
npm install --save react-vue
```

## Usage
```javascript
import React, { Component } from 'react';
import Vue, { observer } from 'react-vue';

const store = new Vue({
  data () {
    return {
      count: 0
    }
  },
  methods: {
    increase () {
      this.count ++;
    }
  }
});

@observer
export default class Demo extends Component {
  render () {
    return <h1 onClick={store.increase}>{store.count}</h1>;
  }
}
```
As shown above, the data changes, the view updates. Most of your vue magic is still available in react, even if [Vuex](https://vuex.vuejs.org/).

[demo](https://github.com/SmallComfort/react-vue-demo)

## API

> Almost all api points to the vue's official document. If you are familiar with vue, there is no unknown usage.

### Global
- [Vue.extend](https://vuejs.org/v2/api/#Vue-extend)

- [Vue.nextTick](https://vuejs.org/v2/api/#Vue-nextTick)

- [Vue.set](https://vuejs.org/v2/api/#Vue-set)

- [Vue.delete](https://vuejs.org/v2/api/#Vue-delete)

- [Vue.use](https://vuejs.org/v2/api/#Vue-use)

- [Vue.mixin](https://vuejs.org/v2/api/#Vue-mixin)

### Options

- [data](https://vuejs.org/v2/api/#data)

- [methods](https://vuejs.org/v2/api/#methods)

- [computed](https://vuejs.org/v2/api/#computed)

- [watch](https://vuejs.org/v2/api/#watch)

- [mixins](https://vuejs.org/v2/api/#mixins)

- [extends](https://vuejs.org/v2/api/#extends)

  > Only options object is allowed

### Instance

- [vm.$watch](https://vuejs.org/v2/api/#vm-watch)

- [vm.$set](https://vuejs.org/v2/api/#vm-set)

- [vm.$delete](https://vuejs.org/v2/api/#vm-delete)

- [vm.$on](https://vuejs.org/v2/api/#vm-on)

- [vm.$once](https://vuejs.org/v2/api/#vm-once)

- [vm.$off](https://vuejs.org/v2/api/#vm-off)

- [vm.$emit](https://vuejs.org/v2/api/#vm-emit)

- [vm.$nextTick](https://vuejs.org/v2/api/#vm-nextTick)

### ```observer``` 
  Inspiration from [mobx](https://github.com/mobxjs/mobx), used to convert React components into reactive components. 

  ```@observer``` ([decorator](https://babeljs.io/docs/plugins/transform-decorators/)) is optional, ```observer(class Timer ... { })``` achieves exactly the same.

## Single File Components
Since react-vue only contains vue's reactivity system, there is no lifecycle, no template. For the full support of SFC, try [react-vue-loader](https://github.com/SmallComfort/react-vue-loader).

[document](https://github.com/SmallComfort/react-vue/blob/dev/packages/react-vue/COMPONENT.md)

## License

[MIT](http://opensource.org/licenses/MIT)
