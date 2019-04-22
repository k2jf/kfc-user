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
    }
  },
  computed: {
    chartOptions () {
      return Object.assign({}, options, {
        legend: {
          shwo: true,
          data: ['塔架', '法兰1', '法兰2', '法兰3', '法兰4']
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          data: ['', '', '优化前', '优化后', '', '']
        },
        yAxis: {
          type: 'value'
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
