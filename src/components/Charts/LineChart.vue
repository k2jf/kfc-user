<template>
  <div class="simple-chart">
    <Chart :options="chartOptions" />
  </div>
</template>

<script >
import options from '@/config/echartConf'

export default {
  name: 'LineChart',
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
          }
        },
        {
          name: data.headers[3],
          type: 'line',
          data: data.items.map(e => [e[3], e[0]]),
          lineStyle: {
            width: 1
          }
        },
        {
          name: data.headers[4],
          type: 'line',
          data: data.items.map(e => [e[4], e[0]]),
          lineStyle: {
            width: 1
          }
        }
      ]
      const _options = Object.assign({}, options, {
        legend: {
          ...options.grid,
          show: false
        },
        grid: {
          ...options.grid,
          bottom: 0
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
