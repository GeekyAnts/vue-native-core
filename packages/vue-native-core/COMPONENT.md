# Vue Component API
> Vue component actually runs in the React runtime. It means, you can not access [VNode](https://vuejs.org/v2/api/#VNode-Interface), you can not use [Render](https://vuejs.org/v2/guide/render-function.html). Conversely, if your previous Vue component does not involve both things, it would most likely run directly in React. 

* web: [react-vue-loader](https://github.com/SmallComfort/react-vue-loader) ([demo](https://github.com/SmallComfort/react-vue-material-demo))
* native: [react-vue-native-scripts](https://github.com/SmallComfort/react-vue-native-scripts) ([demo](https://github.com/SmallComfort/HackerNews))

## Supported API

#### Global Config
> Use the react-vue-loader options: [```vue```](https://github.com/SmallComfort/react-vue-loader#additional-options)
* [silent](https://vuejs.org/v2/api/#silent)

* [optionMergeStrategies](https://vuejs.org/v2/api/#optionMergeStrategies)
* [errorHandler](https://vuejs.org/v2/api/#errorHandler)
* [ignoredElements](https://vuejs.org/v2/api/#ignoredElements) (web only)
* [keyCodes](https://vuejs.org/v2/api/#keyCodes) (web only)

#### Global API
> Use the react-vue-loader options: [```vue```](https://github.com/SmallComfort/react-vue-loader#additional-options)
* [Vue.extend](https://vuejs.org/v2/api/#Vue-extend)

* [Vue.nextTick](https://vuejs.org/v2/api/#Vue-nextTick)
* [Vue.set](https://vuejs.org/v2/api/#Vue-set)
* [Vue.delete](https://vuejs.org/v2/api/#Vue-delete)
* [Vue.directive](https://vuejs.org/v2/api/#Vue-directive) (web only)
  > [partial support](https://github.com/SmallComfort/react-vue/blob/dev/packages/react-vue/COMPONENT.md#options--assets)
* [Vue.component](https://vuejs.org/v2/api/#Vue-component)
* [Vue.use](https://vuejs.org/v2/api/#Vue-use)
* [Vue.mixin](https://vuejs.org/v2/api/#Vue-mixin)
* [Vue.version](https://vuejs.org/v2/api/#Vue-version)

#### Options / Data
* [data](https://vuejs.org/v2/api/#data)

* [props](https://vuejs.org/v2/api/#props)
* [computed](https://vuejs.org/v2/api/#computed)
* [methods](https://vuejs.org/v2/api/#methods)
* [watch](https://vuejs.org/v2/api/#watch)

#### Options / Lifecycle Hooks
* [beforeCreate](https://vuejs.org/v2/api/#beforeCreate)

* [created](https://vuejs.org/v2/api/#created)
* [beforeMount](https://vuejs.org/v2/api/#beforeMount)
* [mounted](https://vuejs.org/v2/api/#mounted)
* [beforeUpdate](https://vuejs.org/v2/api/#beforeUpdate)
* [updated](https://vuejs.org/v2/api/#updated)
* [beforeDestroy](https://vuejs.org/v2/api/#beforeDestroy)

#### Options / Assets
* [directives](https://vuejs.org/v2/api/#directives) (web only)
  * [Hook-Functions](https://vuejs.org/v2/guide/custom-directive.html#Hook-Functions)
    * bind
    * update
    * unbind
  * [Directive-Hook-Arguments](https://vuejs.org/v2/guide/custom-directive.html#Directive-Hook-Arguments)
    * el
    * binding
    * vnode (only one property ```context```)

* [components](https://vuejs.org/v2/api/#components)

#### Options / Composition
* [mixins](https://vuejs.org/v2/api/#mixins)

* [extends](https://vuejs.org/v2/api/#extends)

  > Only options object is allowed

#### Options / Misc
* [name](https://vuejs.org/v2/api/#name)

#### Instance Properties
* [vm.$data](https://vuejs.org/v2/api/#vm-data)

* [vm.$props](https://vuejs.org/v2/api/#vm-props)
* [vm.$el](https://vuejs.org/v2/api/#vm-el)
* [vm.$options](https://vuejs.org/v2/api/#vm-options)
* [vm.$parent](https://vuejs.org/v2/api/#vm-parent)
* [vm.$root](https://vuejs.org/v2/api/#vm-root)
* [vm.$children](https://vuejs.org/v2/api/#vm-children)
* [vm.$slots](https://vuejs.org/v2/api/#vm-slots)
* [vm.$refs](https://vuejs.org/v2/api/#vm-refs)

#### Instance Methods / Data
* [vm.$watch](https://vuejs.org/v2/api/#vm-watch)

* [vm.$set](https://vuejs.org/v2/api/#vm-set)
* [vm.$delete](https://vuejs.org/v2/api/#vm-delete)

#### Instance Methods / Events
* [vm.$on](https://vuejs.org/v2/api/#vm-on)

* [vm.$once](https://vuejs.org/v2/api/#vm-once)
* [vm.$off](https://vuejs.org/v2/api/#vm-off)
* [vm.$emit](https://vuejs.org/v2/api/#vm-emit)

#### Instance Methods / Lifecycle
* [vm.$forceUpdate](https://vuejs.org/v2/api/#vm-forceUpdate)

* [vm.$nextTick](https://vuejs.org/v2/api/#vm-nextTick)

#### Directives
* [v-text](https://vuejs.org/v2/api/#v-text) (web only)

* [v-html](https://vuejs.org/v2/api/#v-html) (web only)
* [v-show](https://vuejs.org/v2/api/#v-show)
* [v-if](https://vuejs.org/v2/api/#v-if)
* [v-else](https://vuejs.org/v2/api/#v-else)
* [v-else-if](https://vuejs.org/v2/api/#v-else-if)
* [v-for](https://vuejs.org/v2/api/#v-for)
* [v-on](https://vuejs.org/v2/api/#v-on) (web only)
* [v-bind](https://vuejs.org/v2/api/#v-bind)
* [v-model](https://vuejs.org/v2/api/#v-model) (web only)
  > Unsupported features: [value bindings checkbox](https://vuejs.org/v2/guide/forms.html#Checkbox-1) & [value bindings select options](https://vuejs.org/v2/guide/forms.html#Select-Options)

#### Special Attributes
* [key](https://vuejs.org/v2/api/#key)

* [ref](https://vuejs.org/v2/api/#ref)
* [slot](https://vuejs.org/v2/api/#slot)
* [is](https://vuejs.org/v2/api/#is)

#### Built-In Components
* [component](https://vuejs.org/v2/api/#component)

* [transition](https://vuejs.org/v2/api/#transition) (web only)
  > The \<transition> would render an extra DOM element, you can configure ```tag``` attribute to custom the extra DOM element

  > Unsupported features: [transition modes](https://vuejs.org/v2/guide/transitions.html#Transition-Modes)

* [slot](https://vuejs.org/v2/api/#slot)

#### Server-Side Rendering (web only)
  > Use React Server Rendering

## Unsupported API

#### Global Config
* ~~[performance](https://vuejs.org/v2/api/#performance)~~
* ~~[devtools](https://vuejs.org/v2/api/#devtools)~~
* ~~[productionTip](https://vuejs.org/v2/api/#productionTip)~~

#### Global API
* ~~[Vue.filter](https://vuejs.org/v2/api/#Vue-filter)~~

* ~~[Vue.compile](https://vuejs.org/v2/api/#Vue-compile)~~

#### Options / Data
* ~~[propsData](https://vuejs.org/v2/api/#propsData)~~

#### Options / DOM
* ~~[el](https://vuejs.org/v2/api/#el)~~

* ~~[template](https://vuejs.org/v2/api/#template)~~
* ~~[render](https://vuejs.org/v2/api/#render)~~
* ~~[renderError](https://vuejs.org/v2/api/#renderError)~~

#### Options / Lifecycle Hooks
* ~~[activated](https://vuejs.org/v2/api/#activated)~~

* ~~[deactivated](https://vuejs.org/v2/api/#deactivated)~~
* ~~[destroyed](https://vuejs.org/v2/api/#destroyed)~~

#### Options / Assets
* ~~[filters](https://vuejs.org/v2/api/#filters)~~

#### Options / Misc
* ~~[delimiters](https://vuejs.org/v2/api/#delimiters)~~

* ~~[functional](https://vuejs.org/v2/api/#functional)~~
* ~~[model](https://vuejs.org/v2/api/#model)~~

#### Instance Properties
* ~~[vm.$scopedSlots](https://vuejs.org/v2/api/#vm-scopedSlots)~~

* ~~[vm.$isServer](https://vuejs.org/v2/api/#vm-isServer)~~

#### Instance Methods / Lifecycle
* ~~[vm.$mount](https://vuejs.org/v2/api/#vm-mount)~~

* ~~[vm.$destroy](https://vuejs.org/v2/api/#vm-destroy)~~

#### Directives
* ~~[v-pre](https://vuejs.org/v2/api/#v-pre)~~

* ~~[v-cloak](https://vuejs.org/v2/api/#v-cloak)~~
* ~~[v-once](https://vuejs.org/v2/api/#v-once)~~

#### Built-In Components
* ~~[transition-group](https://vuejs.org/v2/api/#transition-group)~~
* ~~[keep-alive](https://vuejs.org/v2/api/#keep-alive)~~

#### ~~VNode Interface~~
