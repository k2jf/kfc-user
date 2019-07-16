<template>
  <div class="h-full overflow-hidden">
    <Row style="height:50%" v-if="geoOpts.length > 0">
      <h3 class="text-sm pl-3 h-8">
        几何尺寸图
      </h3>
      <ICol
        style="height:calc(100% - 32px)"
        span="8"
        v-for="(opt, key) in geoOpts"
        :key="key">
        <Chart :options="opt" autoresize />
      </ICol>
    </Row>
    <Row style="height:50%" v-if="placeOpts.length > 0">
      <h3 class="text-sm pl-3 h-8">
        位移图
      </h3>
      <ICol
        style="height:calc(100% - 32px)"
        span="8"
        v-for="(opt, key) in placeOpts"
        :key="key">
        <Chart :options="opt" autoresize />
      </ICol>
    </Row>
  </div>
</template>

<script>
import { Row, Col } from 'iview'
import options from '@/config/echartConf'

export default {
  name: 'FdChart',
  components: {
    Row,
    ICol: Col
  },
  data () {
    return {
      geoOpts: [],
      placeOpts: []
    }
  },
  mounted () {
    this.initGeo()
    this.initPlace()
  },
  methods: {
    async initGeo () {
      const res = await this.$get(`foundations/${this.$route.params.foundationId}/geometry`)
      if (res.body.items.length > 0) {
        const items = res.body.items.map(item => [item[0], item[1] / 2, item[2], item[3]])
        this.geoOpts = [1, 2, 3].map(item => {
          let data = items.map(ele => [ele[item], ele[0]])
          let markLine = null
          if (item === 1) {
            const leftData = items.map(ele => [-ele[item], ele[0]])
            data = [...leftData, ...data]
          }
          if (item === 3) {
            markLine = {
              symbol: 'none',
              label: {
                position: 'middle',
                formatter: ''
              },
              lineStyle: {
                color: '#666'
              },
              data: [
                { xAxis: 120 }
              ]
            }
          }
          data.sort((first, second) => first[0] - second[0])
          return Object.assign({}, options, {
            grid: {
              ...options.grid,
              right: 30,
              left: 50,
              bottom: 40
            },
            legend: {
              show: false
            },
            yAxis: {
              ...options.yAxis,
              name: res.body.schema[0].name,
              nameLocation: 'center',
              nameGap: 40,
              axisLine: {
                onZero: item === 1
              }
            },
            xAxis: {
              ...options.xAxis,
              name: item === 1 ? 'm' : res.body.schema[item].name,
              nameLocation: 'center',
              nameGap: 30,
              axisLine: { onZero: true },
              max: item === 3 ? function (value) {
                return Math.min(value.max + 20, 125)
              } : undefined
            },
            series: [{
              name: res.body.schema[item].name,
              type: 'line',
              data,
              lineStyle: { width: 1 },
              symbolSize: 1,
              markLine
            }]
          })
        })
      }
    },
    async initPlace () {
      const res = await this.$get(`foundations/${this.$route.params.foundationId}/displacement`)
      if (res.body.items.length > 0) {
        this.placeOpts = [1, 2, 3].map(item => Object.assign({}, options, {
          grid: {
            ...options.grid,
            right: 30,
            left: 50,
            bottom: 100
          },
          legend: {
            show: false
          },
          yAxis: {
            ...options.yAxis,
            name: res.body.schema[0].name,
            nameLocation: 'center',
            nameGap: 40
          },
          xAxis: {
            ...options.xAxis,
            name: res.body.schema[item].name,
            nameLocation: 'center',
            nameGap: 30,
            axisLine: { onZero: true }
          },
          series: [{
            name: res.body.schema[item].name,
            type: 'line',
            data: res.body.items.map(ele => [ele[item], -ele[0]]),
            lineStyle: { width: 1 },
            symbolSize: 1
          }]
        }))
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
