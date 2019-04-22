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
    }
  },
  computed: {
    chartOptions () {
      return Object.assign({}, options, {
        legend: {
          shwo: true
        },
        xAxis: {
          type: 'value'
        },
        tooltip: {
          show: true,
          axisPointer: {
            type: 'cross'
          }
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
  .ido-step-line-chart {
    width: 500px;
    height: 400px;
  }
</style>
