const path = require('path')

module.exports = {
  vue: path.resolve(__dirname, '../src/platforms/web/runtime-with-compiler'),
  compiler: path.resolve(__dirname, '../src/compiler'),
  core: path.resolve(__dirname, '../src/core'),
  shared: path.resolve(__dirname, '../src/shared'),
  web: path.resolve(__dirname, '../src/platforms/web'),
  'vue-native': path.resolve(__dirname, '../src/platforms/vue-native'),
  sfc: path.resolve(__dirname, '../src/sfc'),
}
