module.exports = {
  css: {
    loaderOptions: {
      less: {
        data: '@import "@/variables.less";'
      }
    }
  },
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
  configureWebpack: config => {
    config.module.rules.push({
      test: /\.(ksvg)(\?.*)?$/,
      use: {
        loader: 'raw-loader'
      }
    })
  }
  // chainWebpack: config => {
  //   const svgRule = config.module.rule('svg')

  //   svgRule.uses.clear()
  //   svgRule
  //     .use('raw-loader')
  //     .loader('raw-loader')
  //     .end()
  // }
}
