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
          data: [0.6, 0.5, 0.4, 0.3],
          amplitude: 6,
          outline: {
            show: false
          },
          radius: '60%',
          // color: ['#4fc08d', '#44d64a', '#33c762', '#4acc80'],
          backgroundStyle: {
            color: '#fff',
            borderColor: '#3d7aab',
            borderWidth: 1
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
