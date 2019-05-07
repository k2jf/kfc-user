<template>
  <div class="ido-step-line-chart ido-chart">
    <Chart :options="chartOptions" autoresize />
  </div>
</template>

<script>
import options from '@/config/echartConf'

export default {
  name: 'StepLineChart',
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
          shwo: true
        },
        xAxis: {
          type: 'value',
          nameTextStyle: options.xAxis.nameTextStyle,
          ...this.xAxis
        },
        tooltip: {
          show: true,
          axisPointer: {
            type: 'cross'
          }
        },
        yAxis: {
          type: 'value',
          nameTextStyle: options.yAxis.nameTextStyle,
          ...this.yAxis
        },
        grid: {
          ...options.grid,
          right: 70,
          left: 30
        },
        series: this.series
      })
    }
  }
}
</script>
<style lang="less">
  .ido-step-line-chart {
    width: 500px;
    height: 400px;
  }
</style>
