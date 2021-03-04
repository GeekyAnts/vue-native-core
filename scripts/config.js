const path = require('path')
const buble = require('rollup-plugin-buble')
const alias = require('rollup-plugin-alias')
const replace = require('rollup-plugin-replace')
const flow = require('rollup-plugin-flow-no-whitespace')
const prettier = require('rollup-plugin-prettier')

const version = '2.2.6'

// const banner =
//   "/*!\n" +
//   " * Vue Native v" +
//   version +
//   "\n" +
//   " * (c) 2018-" +
//   new Date().getFullYear() +
//   " GeekyAnts Software Pvt. Ltd.\n" +
//   " * Released under the MIT License.\n" +
//   " */"

const aliases = require('./alias')
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}

const builds = {
  'vue-native-core': {
    entry: resolve('vue-native/index.js'),
    dest: resolve('packages/vue-native-core/build.js'),
    format: 'cjs',
    external: ['react'],
  },
  'vue-native-helper': {
    entry: resolve('vue-native/runtime/helpers.js'),
    dest: resolve('packages/vue-native-helper/build.js'),
    format: 'cjs',
  },
  'vue-native-scripts': {
    entry: resolve('vue-native/scripts/index.js'),
    dest: resolve('packages/vue-native-scripts/build.js'),
    format: 'cjs',
    external: []
      .concat(
        Object.keys(
          require('../packages/vue-native-scripts/package.json').dependencies,
        ),
      )
      .concat(
        Object.keys(
          require('../packages/vue-native-scripts/package.json')
            .peerDependencies,
        ),
      ),
  },
  'vue-native-template-compiler': {
    entry: resolve('vue-native/compiler.js'),
    dest: resolve('packages/vue-native-template-compiler/build.js'),
    format: 'cjs',
    external: ['change-case', 'he', 'de-indent', 'lodash'],
  },
}

function genConfig(opts) {
  const config = {
    input: opts.entry,
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: 'Vue',
    },
    external: opts.external,
    plugins: [
      replace({
        __VERSION__: version,
      }),
      flow(),
      buble(),
      alias(Object.assign({}, aliases, opts.alias)),
      prettier(),
    ].concat(opts.plugins || []),
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    },
  }

  if (opts.env) {
    config.plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify(opts.env),
      }),
    )
  }

  return config
}

if (process.env.TARGET) {
  module.exports = genConfig(builds[process.env.TARGET])
} else {
  exports.getBuild = name => genConfig(builds[name])
  exports.getAllBuilds = () =>
    Object.keys(builds).map(name => genConfig(builds[name]))
}
