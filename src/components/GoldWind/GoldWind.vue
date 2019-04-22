<template>
  <Chart
    style="height:100%;width:100%;"
    :options="options"
    :init-options="initOptions"
    autoresize
    id="logo"
  />
</template>

<script>
import logo from '@/assets/gw_logo.ksvg'

let d = logo.match(/\bd="([^"]+)"/)[1]

console.log(d)

export default {
  name: 'GoldWind',
  data: () => ({
    initOptions: {
      renderer: 'canvas'
    },
    options: {
      series: [
        {
          type: 'liquidFill',
          data: [0.54, 0.4, 0.3],
          // data: [0.9, 0.7, 0.6, 0.5],
          amplitude: 2,
          outline: {
            show: false
          },
          radius: '90%',
          // color: ['#4fc08d', '#44d64a', '#33c762', '#4acc80'],
          backgroundStyle: {
            color: '#fff',
            borderColor: '#fff',
            borderWidth: 0
          },
          itemStyle: {
            opacity: 1
          },
          shape: `path://${d}`,
          label: {
            normal: {
              formatter () {
                return ''
              }
            }
          }
        }
      ]
    }
  })

}
</script>

<style lang="scss" scoped>

</style>
