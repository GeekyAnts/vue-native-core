const path = require("path");
const buble = require("rollup-plugin-buble");
const alias = require("rollup-plugin-alias");
const replace = require("rollup-plugin-replace");
const flow = require("rollup-plugin-flow-no-whitespace");
const version = process.env.VERSION || require("../package.json").version;
const weexVersion =
  process.env.WEEX_VERSION ||
  require("../packages/weex-vue-framework/package.json").version;

const banner =
  "/*!\n" +
  " * Vue.js v" +
  version +
  "\n" +
  " * (c) 2014-" +
  new Date().getFullYear() +
  " Evan You\n" +
  " * Released under the MIT License.\n" +
  " */";

const weexFactoryPlugin = {
  intro() {
    return "module.exports = function weexFactory (exports, renderer) {";
  },
  outro() {
    return "}";
  }
};

const aliases = require("./alias");
const resolve = p => {
  const base = p.split("/")[0];
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1));
  } else {
    return path.resolve(__dirname, "../", p);
  }
};

const builds = {
  "vue-native-core": {
    entry: resolve("vue-native/index.js"),
    dest: resolve("packages/vue-native-core/build.js"),
    format: "cjs",
    external: ["react"]
  },
  "vue-native-helper": {
    entry: resolve("vue-native/runtime/helpers.js"),
    dest: resolve("packages/vue-native-helper/build.js"),
    format: "cjs",
    external: ["react", "change-case", "he", "de-indent"]
  },
  "vue-native-template-compiler": {
    entry: resolve("vue-native/compiler.js"),
    dest: resolve("packages/vue-native-template-compiler/build.js"),
    format: "cjs",
    external: ["change-case", "he", "de-indent"]
  }
};

function genConfig(opts) {
  const config = {
    entry: opts.entry,
    dest: opts.dest,
    external: opts.external,
    format: opts.format,
    banner: opts.banner,
    moduleName: "Vue",
    plugins: [
      replace({
        __WEEX__: !!opts.weex,
        __WEEX_VERSION__: weexVersion,
        __VERSION__: version
      }),
      flow(),
      buble(),
      alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || [])
  };

  if (opts.env) {
    config.plugins.push(
      replace({
        "process.env.NODE_ENV": JSON.stringify(opts.env)
      })
    );
  }

  return config;
}

if (process.env.TARGET) {
  module.exports = genConfig(builds[process.env.TARGET]);
} else {
  exports.getBuild = name => genConfig(builds[name]);
  exports.getAllBuilds = () =>
    Object.keys(builds).map(name => genConfig(builds[name]));
}
