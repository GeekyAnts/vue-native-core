# Vue Native: Read more at [vue-native.io](https://vue-native.io)
[![Backers on Open Collective](https://opencollective.com/vue-native-core/backers/badge.svg)](#backers)
 [![Sponsors on Open Collective](https://opencollective.com/vue-native-core/sponsors/badge.svg)](#sponsors) 

### Start with the Vue Native CLI

The Vue Native CLI is used to generate a `Vue Native` app, which is a React Native API wrapper. This means that with Vue Native, you can do anything that could be done with React Native.

The Vue Native CLI generates a simple single page application (SPA) using [expo-cli](https://github.com/expo/expo-cli) and
[vue-native-core](https://github.com/GeekyAnts/vue-native-core).

## Installation Prerequisites

You should have expo-cli or react-native-cli installed as a global dependency

in linux need set corect permission in npm folder
```
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```
```
For React Native ClI => npm install react-native-cli -g
```

```
For CRNA => npm install expo-cli -g
```

## Installation:

```
$ npm install -g vue-native-cli
```

Generate [CRNA + Vue App](https://github.com/GeekyAnts/vue-native-core)

```
$ vue-native init <projectName>
```

## NOTE: 

```
'NetInfo',
  'AsyncStorage',
  'AlertIOS',
  'WebView',
  'ViewPagerAndroid',
  'ListView',
  'SwipeableListView',
  'Slider'
``` 
The above modules are set to be removed from future core react-native. 
Hence these modules can no longer be imported from vue-native.
[[Further Instructions](https://facebook.github.io/react-native/blog/2019/03/12/releasing-react-native-059#lean-core-is-underway)]

## Contributors

This project exists thanks to all the people who contribute. 
<a href="https://github.com/GeekyAnts/vue-native-core/contributors"><img src="https://opencollective.com/vue-native-core/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/vue-native-core#backer)]

<a href="https://opencollective.com/vue-native-core#backers" target="_blank"><img src="https://opencollective.com/vue-native-core/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/vue-native-core#sponsor)]

<a href="https://opencollective.com/vue-native-core/sponsor/0/website" target="_blank"><img src="https://opencollective.com/vue-native-core/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/vue-native-core/sponsor/1/website" target="_blank"><img src="https://opencollective.com/vue-native-core/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/vue-native-core/sponsor/2/website" target="_blank"><img src="https://opencollective.com/vue-native-core/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/vue-native-core/sponsor/3/website" target="_blank"><img src="https://opencollective.com/vue-native-core/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/vue-native-core/sponsor/4/website" target="_blank"><img src="https://opencollective.com/vue-native-core/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/vue-native-core/sponsor/5/website" target="_blank"><img src="https://opencollective.com/vue-native-core/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/vue-native-core/sponsor/6/website" target="_blank"><img src="https://opencollective.com/vue-native-core/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/vue-native-core/sponsor/7/website" target="_blank"><img src="https://opencollective.com/vue-native-core/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/vue-native-core/sponsor/8/website" target="_blank"><img src="https://opencollective.com/vue-native-core/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/vue-native-core/sponsor/9/website" target="_blank"><img src="https://opencollective.com/vue-native-core/sponsor/9/avatar.svg"></a>



## License

[MIT](http://opensource.org/licenses/MIT)

## Credits to [react-vue](https://github.com/SmallComfort/react-vue)

A huge thanks to the author of react-vue for most of the work on Vue Native.
