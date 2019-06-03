<template>
  <div class="chart-result h-full">
    <Row style="height:100%;">
      <ICol span="12" class="h-half">
        <h3 class="text-center">
          优化前后塔架重量
        </h3>
        <BarChart :series="barSeries" :yAxis="{ name: 'Weight(t)' }" />
      </ICol>
      <ICol span="12" class="h-half">
        <h3 class="text-center">
          优化前后塔架壁厚
        </h3>
        <StepLineChart :series="stepLineSeries" :yAxis="{ name: 'Height(m)' }" :xAxis="{ name: 'Width(mm)' }" />
      </ICol>
      <ICol span="12" class="h-half">
        <h3 class="text-center">
          优化前SRF分布
        </h3>
        <LineChart :series="checkSRFSeries" :xAxis="checkXAxis" :yAxis="checkYAxis" />
      </ICol>
      <ICol span="12" class="h-half">
        <h3 class="text-center">
          优化后SRF分布
        </h3>
        <LineChart :series="optSRFSeries" :xAxis="checkXAxis" :yAxis="checkYAxis" />
      </ICol>
    </Row>
  </div>
</template>

<script>
import { BarChart, StepLineChart, LineChart } from '@/components/Charts'
import { Row, Col } from 'iview'
import { mapState } from 'vuex'

const colors = ['red', '#333', 'green']

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
    checkXAxis: {
      name: 'SRF',
      min: 0,
      max: 3
    },
    checkYAxis: { name: 'Height(m)' }
  }),
  computed: {
    ...mapState({
      results: state => state.tower.results
    }),
    barSeries () {
      const { optWeight, checkedWeight } = this.results
      if (!optWeight || !checkedWeight) return []
      const _series = Object.keys(optWeight).map(ele => ({
        name: optWeight[ele].name,
        type: 'bar',
        stack: 'weight',
        emphasis: {
          itemStyle: {
            barBorderWidth: 1,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        },
        data: [0, 0, this.strip(checkedWeight[ele].data), this.strip(optWeight[ele].data)]
      }))
      console.log(_series)
      return _series
    },
    stepLineSeries () {
      const { towerCheck, optResult } = this.results
      if (!towerCheck || !optResult) return []
      const _check = towerCheck.items.map(t => ([t[1], t[0]]))
      const _opt = optResult.items.map(o => ([o[4], o[0]]))
      return [
        {
          name: '校核',
          type: 'line',
          step: 'start',
          data: _check,
          lineStyle: { width: 1 },
          symbolSize: 1
        },
        {
          name: '优化后',
          type: 'line',
          step: 'start',
          data: _opt,
          lineStyle: { width: 1 },
          symbolSize: 1
        }
      ]
    },
    checkSRFSeries () {
      const { towerCheck } = this.results
      if (!towerCheck) return []
      const { headers, items } = towerCheck
      return [2, 3, 4].map((ind, idx) => ({
        name: headers[ind],
        type: 'line',
        data: items.filter(ele => ele[ind] <= 2).map(ele => [ele[ind], ele[0]]),
        lineStyle: { width: 1, color: colors[idx] },
        symbolSize: 1,
        markLine: {
          symbol: 'none',
          label: {
            position: 'end'
          },
          lineStyle: {
            color: '#666'
          },
          data: [
            { xAxis: 1.0 },
            { xAxis: 1.1 }
          ]
        }
      }))
    },
    optSRFSeries () {
      const { optResult } = this.results
      if (!optResult) return []
      const { headers, items } = optResult
      return [1, 2, 3].map((ind, idx) => ({
        name: headers[ind],
        type: 'line',
        data: items.filter(ele => ele[ind] <= 2).map(ele => [ele[ind], ele[0]]),
        lineStyle: { width: 1, color: colors[idx] },
        symbolSize: 1,
        markLine: {
          symbol: 'none',
          label: {
            position: 'end'
          },
          lineStyle: {
            color: '#666'
          },
          data: [
            { xAxis: 1.0 },
            { xAxis: 1.1 }
          ]
        }
      }))
    }
  },
  methods: {
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
