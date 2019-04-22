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
    }
  },
  computed: {
    chartOptions () {
      return Object.assign({}, options, {
        legend: {
          show: true
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
