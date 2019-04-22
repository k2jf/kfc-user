<template>
  <div class="chart-result h-full">
    <Row style="height:100%;">
      <ICol span="12" class="h-half">
        <h3 class="text-center">
          优化前后塔架重量
        </h3>
        <BarChart :series="barSeries" />
      </ICol>
      <ICol span="12" class="h-half">
        <h3 class="text-center">
          优化前后塔架壁厚
        </h3>
        <StepLineChart :series="stepLineSeries" />
      </ICol>
      <ICol span="12" class="h-half">
        <h3 class="text-center">
          优化前SRF分布
        </h3>
        <LineChart :series="checkSRFSeries" />
      </ICol>
      <ICol span="12" class="h-half">
        <h3 class="text-center">
          优化后SRF分布
        </h3>
        <LineChart :series="optSRFSeries" />
      </ICol>
    </Row>
  </div>
</template>

<script>
import { BarChart, StepLineChart, LineChart } from '@/components/Charts'
import { Row, Col } from 'iview'

export default {
  name: 'ChartResult',
  components: {
    BarChart,
    LineChart,
    StepLineChart,
    Row,
    ICol: Col
  },
  data: () => ({
    results: {}
  }),
  computed: {
    barSeries () {
      const { optWeight, checkedWeight } = this.results
      if (!optWeight || !checkedWeight) return []
      const _series = Object.keys(optWeight).map(ele => ({
        name: optWeight[ele].name,
        type: 'bar',
        stack: 'weight',
        itemStyle: {
          normal: {
          },
          emphasis: {
            barBorderWidth: 1,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        },
        data: [0, 0, this.strip(checkedWeight[ele].data), this.strip(optWeight[ele].data)]
      }))
      return _series
    },
    stepLineSeries () {
      const { towerCheck, optResult } = this.results
      if (!towerCheck || !optResult) return []
      const _check = towerCheck.items.map(t => ([t[0], t[1]]))
      const _opt = optResult.items.map(o => ([o[0], o[4]]))
      return [
        {
          name: '校核',
          type: 'line',
          step: 'start',
          data: _check
        },
        {
          name: '优化后',
          type: 'line',
          step: 'start',
          data: _opt
        }
      ]
    },
    checkSRFSeries () {
      const { towerCheck } = this.results
      if (!towerCheck) return []
      const { headers, items } = towerCheck
      return [2, 3, 4].map(ind => ({
        name: headers[ind],
        type: 'line',
        data: items.map(ele => [ele[ind], ele[0]]),
        lineStyle: { width: 1 }
      }))
    },
    optSRFSeries () {
      const { optResult } = this.results
      if (!optResult) return []
      const { headers, items } = optResult
      return [1, 2, 3].map(ind => ({
        name: headers[ind],
        type: 'line',
        data: items.map(ele => [ele[ind], ele[0]]),
        lineStyle: { width: 1 }
      }))
    }
  },
  mounted () {
    this.getTaskResult()
  },
  methods: {
    async getTaskResult () {
      const res = await this.$get(`towerTasks/${this.$route.params.taskId}/result`)
      this.results = res.body
    },
    strip (num) {
      return parseFloat(num.toFixed(3))
    }
  }
}
</script>
<style lang="less">
  .chart-result .ido-chart {
    width: 100%;
    height: 100%;
    min-height: 200px;
    padding: 0 30px;
  }
</style>
