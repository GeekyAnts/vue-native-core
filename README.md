# React-Vue
##This is fork of react-vue
#https://github.com/SmallComfort/react-vue
React-Vue is designed to connect React and Vue. Which help you run Vue in React.

There are three uses.

* Use the [reactivity system](#reactivity-system) of Vue to observer React component
* Use the [react-vue-loader](#vue-component) to run Vue component in React application
* Use the [react-vue-native-scripts](#native) to run Vue component in React Native

### Reactivity System
Thanks to Vue's clear hierarchical design, we can easily pull out the reactivity system (9 KB gzipped), and drive React component rendering. 

```
npm install --save react-vue
```

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
[document](https://github.com/SmallComfort/react-vue/blob/dev/packages/react-vue/README.md) 

### Vue Component
Introduce [react-vue-loader](https://github.com/SmallComfort/react-vue-loader), which compile the Vue component into a React component. As you might think, your previously written Vue components can run inside the React component, and your React components can also run inside the Vue component.

```
npm install --save react-vue react-vue-helper
npm install --save-dev react-vue-loader
```

```javascript
// One.js
import React, { Component } from 'react';
import Two from './Two';

export default class One extends Component {
  render() {
    return <Two>Hello Vue</Two>;
  }
}
```

```html
<!-- Two.vue -->
<template>
  <div @click="count++">
    <three>{{count}}</three>
    <slot></slot>
  </div>
</template>

<script>
  import Three from './Three'
  export default {
    components: { Three },
    data () {
      return {
        count: 0
      }
    }
  }
</script>
```

```javascript
// Three.js
import React, { Component } from 'react';

export default class Three extends Component {
  render () {
    return <span>{this.props.children}</span>
  }
}
```

[document](https://github.com/SmallComfort/react-vue/blob/dev/packages/react-vue/COMPONENT.md)

### Native
Introduce [react-vue-native-scripts](https://github.com/SmallComfort/react-vue-native-scripts), which start a server to compile the vue component into a react component.

```
npm install --save react-vue react-vue-helper
npm install --save-dev react-vue-native-scripts
```

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
import React, { Component } from 'react';
import { View, Text, Animated } from 'react-native';

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
> You can use all the [React Native API](https://facebook.github.io/react-native/) in Vue component.  The camelCased prop names need to use their kebab-case (hyphen-delimited) equivalents

[document](https://github.com/SmallComfort/react-vue/blob/dev/packages/react-vue/COMPONENT.md) 

## License

[MIT](http://opensource.org/licenses/MIT)
