<template>
  <div class="h-full overflow-hidden">
    <Row style="height:50%">
      <h3 class="text-xs pl-3">
        几何尺寸图
      </h3>
      <ICol
        class="h-full"
        span="8"
        v-for="(opt, key) in geoOpts"
        :key="key">
        <Chart :options="opt" autoresize />
      </ICol>
    </Row>
    <Row style="height:50%">
      <h3 class="text-xs pl-3">
        位移图
      </h3>
      <ICol
        class="h-full"
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
      this.geoOpts = [1, 2, 3].map(item => Object.assign({}, options, {
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
          data: res.body.items.map(ele => [ele[item], ele[0]]),
          lineStyle: { width: 1 },
          symbolSize: 1
        }]
      }))
    },
    async initPlace () {
      const res = await this.$get(`foundations/${this.$route.params.foundationId}/displacement`)
      this.placeOpts = [1, 2, 3].map(item => Object.assign({}, options, {
        grid: {
          ...options.grid,
          right: 30,
          left: 50,
          bottom: 80
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
          data: res.body.items.map(ele => [ele[item], ele[0]]),
          lineStyle: { width: 1 },
          symbolSize: 1
        }]
      }))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
