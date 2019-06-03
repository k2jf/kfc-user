<template>
  <div class="ido-bar-chart ido-chart">
    <Chart :options="chartOptions" autoresize />
  </div>
</template>

<script>
import options from '@/config/echartConf'

export default {
  name: 'BarChart',
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
          type: 'scroll',
          itemWidth: 15,
          itemHeight: 10,
          data: this.series.map(s => s.name)
        },
        grid: {
          ...options.grid,
          right: 40,
          left: 30,
          top: 60
        },
        toolbox: {
          show: true,
          top: 20,
          orient: 'vertical',
          feature: {
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          ...this.xAxis,
          nameTextStyle: options.xAxis.nameTextStyle,
          type: 'category',
          axisTick: {
            show: false
          },
          data: ['', '', '优化前', '优化后', '', '']
        },
        yAxis: {
          type: 'value',
          nameTextStyle: options.yAxis.nameTextStyle,
          ...this.yAxis
        },
        series: this.series
      })
    }
  }
}
</script>
<style lang="less">
  .ido-bar-chart {
    width: 500px;
    height: 400px;
  }
</style>
