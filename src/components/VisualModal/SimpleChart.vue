<template>
  <div class="simple-chart">
    <Chart :options="chartOptions" />
  </div>
</template>

<script >
import options from '@/config/echartConf'

export default {
  name: 'SimpleChart',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      echart: null
    }
  },
  computed: {
    chartOptions () {
      const data = this.data
      if (!data.headers || data.headers.length === 0) return
      let traces = [
        {
          name: data.headers[2],
          type: 'line',
          data: data.items.map(e => [e[2], e[0]]),
          lineStyle: {
            width: 1
          },
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
        },
        {
          name: data.headers[3],
          type: 'line',
          data: data.items.map(e => [e[3], e[0]]),
          lineStyle: {
            width: 1
          },
          symbolSize: 1
        },
        {
          name: data.headers[4],
          type: 'line',
          data: data.items.map(e => [e[4], e[0]]),
          lineStyle: {
            width: 1
          },
          symbolSize: 1
        }
      ]
      const _options = Object.assign({}, options, {
        grid: {
          ...options.grid,
          bottom: 0,
          right: '6%'
        },
        xAxis: {
          ...options.xAxis,
          name: 'SRF',
          min: 0,
          max: 3
        },
        yAxis: {
          ...options.yAxis,
          name: 'Height'
        },
        tooltip: {
          show: true,
          axisPointer: {
            type: 'cross'
          }
        },
        series: traces
      })
      return _options
    }
  }
}
</script>

<style lang="less" scoped>
  .simple-chart {
    height: 403px;
  }
</style>
<style>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
