<template>
  <div class="ido-bar-chart">
    <Chart :options="chartOptions" />
  </div>
</template>

<script>
import options from '@/config/echartConf'

export default {
  name: 'BarChart',
  props: {
    data: {
      type: Object
      // required: true
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
        series: [
          {
            name: '塔架',
            type: 'bar',
            stack: 'one',
            data: [0, 0, 200, 170],
            barWidth: 40
          },
          {
            name: '法兰1',
            type: 'bar',
            stack: 'one',
            data: [0, 0, 40, 36],
            barWidth: 40
          },
          {
            name: '法兰2',
            type: 'bar',
            stack: 'one',
            data: [0, 0, 50, 50],
            barWidth: 40
          },
          {
            name: '法兰3',
            type: 'bar',
            stack: 'one',
            data: [0, 0, 32, 28],
            barWidth: 40
          },
          {
            name: '法兰4',
            type: 'bar',
            stack: 'one',
            data: [0, 0, 80, 70],
            barWidth: 40
          },
          {
            type: 'line',
            symbol: 'none',
            lineStyle: {
              width: 1,
              color: 'red'
            },
            data: [
              ['优化前', 200],
              ['优化后', 170]
            ]
          },
          {
            type: 'line',
            symbol: 'none',
            lineStyle: {
              width: 1,
              color: 'red'
            },
            data: [
              ['优化前', 240],
              ['优化后', 206]
            ]
          },
          {
            type: 'line',
            symbol: 'none',
            lineStyle: {
              width: 1,
              color: 'red'
            },
            data: [
              ['优化前', 290],
              ['优化后', 256]
            ]
          },
          {
            type: 'line',
            symbol: 'none',
            lineStyle: {
              width: 1,
              color: 'red'
            },
            data: [
              ['优化前', 322],
              ['优化后', 284]
            ]
          },
          {
            type: 'line',
            symbol: 'none',
            lineStyle: {
              width: 1,
              color: 'red'
            },
            data: [
              ['优化前', 402],
              ['优化后', 354]
            ]
          }
        ]
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
