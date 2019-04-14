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
  ]
}
