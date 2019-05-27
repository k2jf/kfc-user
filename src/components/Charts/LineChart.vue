<template>
  <div class="ido-line-chart ido-chart">
    <Chart :options="chartOptions" autoresize />
  </div>
</template>

<script >
import options from '@/config/echartConf'

export default {
  name: 'LineChart',
  props: {
    series: {
      type: Array,
      required: true
    },
    xAxis: {
      type: Object,
      default: () => ({})
    },
    yAxis: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    chartOptions () {
      return Object.assign({}, options, {
        legend: {
          show: true
        },
        xAxis: {
          ...options.xAxis,
          ...this.xAxis,
          min: 0.5,
          max: 2
        },
        grid: {
          ...options.grid,
          right: 40,
          left: 30
        },
        yAxis: {
          ...options.yAxis,
          ...this.yAxis
        },
        series: this.series
      })
    }
  }
}
</script>

<style lang="less">
  .ido-line-chart {
    width: 500px;
    height: 400px;
  }
</style>
