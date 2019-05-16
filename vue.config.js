const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

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
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static'
        })
      )
    }
  },
  productionSourceMap: false
}
