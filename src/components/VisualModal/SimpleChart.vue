<template>
  <div class="simple-chart" ref="chart">
  </div>
</template>

<script >
import echarts from 'echarts'
import options from './conf'
import { debounce } from '@/libs/helpers'

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
  watch: {
    data (value) {
      this.pickOptions(value)
    }
  },
  mounted () {
    this.echart = echarts.init(this.$refs.chart)
    window.addEventListener('resize', this.resize.bind(this))
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize.bind(this))
  },
  methods: {
    resize: debounce(function () {
      if (this.$refs.chart && this.$refs.chart.offsetWidth > 0 && this.echart) {
        this.echart.resize()
      }
    }),
    pickOptions (data) {
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
      this.echart.setOption(_options, true)
    }
  }
}
</script>

<style lang="less" scoped>
  .simple-chart {
    height: 403px;
  }
</style>
