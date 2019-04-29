<template>
  <div class="echarts" />
</template>

<style>
.echarts {
  width: 600px;
  height: 400px;
}
</style>

<script>
import echarts from 'echarts/lib/echarts'
import debounce from 'lodash/debounce'
import { addListener, removeListener } from 'resize-detector'

// 枚举 echarts 所有事件，初始化 ecahrts 的时候
// 以自定义事件的形式暴露出去
const EVENTS = [
  'legendselectchanged',
  'legendselected',
  'legendunselected',
  'legendscroll',
  'datazoom',
  'datarangeselected',
  'timelinechanged',
  'timelineplaychanged',
  'restore',
  'dataviewchanged',
  'magictypechanged',
  'geoselectchanged',
  'geoselected',
  'geounselected',
  'pieselectchanged',
  'pieselected',
  'pieunselected',
  'mapselectchanged',
  'mapselected',
  'mapunselected',
  'axisareaselected',
  'focusnodeadjacency',
  'unfocusnodeadjacency',
  'brush',
  'brushselected',
  'rendered',
  'finished',
  'click',
  'dblclick',
  'mouseover',
  'mouseout',
  'mousemove',
  'mousedown',
  'mouseup',
  'globalout',
  'contextmenu'
]

export default {
  props: {
    options: Object, // ECharts 实例的数据。修改这个 prop 会触发 ECharts 实例的 setOption 方法。
    theme: [String, Object],
    initOptions: Object, // 用来初始化 ECharts 实例。
    group: String,
    autoresize: Boolean,
    watchShallow: Boolean,
    manualUpdate: Boolean // 大数据场景下（性能敏感），对于 options prop 绕过 Vue 的响应式系统
  },
  data () {
    return {
      lastArea: 0
    }
  },
  watch: {
    group (group) {
      this.chart.group = group
    }
  },
  created () {
    if (!this.manualUpdate) {
      // ??? watch 和 $watch 区别
      this.$watch('options', (val, oldVal) => {
        if (!this.chart && val) {
          this.init()
        } else {
          // 如果直接修改 options 绑定的数据而对象引用保持不变，
          // setOption 方法调用时将带有参数 notMerge: false。
          // 否则，如果为 options 绑定一个新的对象，
          // setOption 方法调用时则将带有参数 notMerge: true。
          // eg.
          // `this.options = Object.assign({}, this.options, { ... })`
          // 会触发 `this.chart.setOption(val, true)
          // `this.options.title.text = 'Trends'`
          // 会触发 `this.chart.setOption(val, false)`
          this.chart.setOption(val, val !== oldVal)
        }
      }, { deep: !this.watchShallow })
    }
    // watch 传入的 props，当以下 prop 改变时，
    // 销毁并重新创建 echart 实例
    let watched = ['theme', 'initOptions', 'autoresize', 'manualUpdate', 'watchShallow']
    watched.forEach(prop => {
      this.$watch(prop, () => {
        this.refresh()
      }, { deep: true })
    })
  },
  mounted () {
    if (this.options) {
      this.init()
    }
  },
  activated () {
    if (this.autoresize) {
      this.chart && this.chart.resize()
    }
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.destroy()
  },
  methods: {
    mergeOptions (options, notMerge, lazyUpdate) {
      if (this.manualUpdate) {
        this.manualOptions = options
      }
      if (!this.chart) {
        this.init()
      } else {
        this.delegateMethod('setOption', options, notMerge, lazyUpdate)
      }
    },
    // 代理 echarts 方法
    appendData (params) {
      this.delegateMethod('appendData', params)
    },
    resize (options) {
      this.delegateMethod('resize', options)
    },
    dispatchAction (payload) {
      this.delegateMethod('dispatchAction', payload)
    },
    convertToPixel (finder, value) {
      return this.delegateMethod('convertToPixel', finder, value)
    },
    convertFromPixel (finder, value) {
      return this.delegateMethod('convertFromPixel', finder, value)
    },
    containPixel (finder, value) {
      return this.delegateMethod('containPixel', finder, value)
    },
    showLoading (type, options) {
      this.delegateMethod('showLoading', type, options)
    },
    hideLoading () {
      this.delegateMethod('hideLoading')
    },
    getDataURL (options) {
      return this.delegateMethod('getDataURL', options)
    },
    getConnectedDataURL (options) {
      return this.delegateMethod('getConnectedDataURL', options)
    },
    clear () {
      this.delegateMethod('clear')
    },
    dispose () {
      this.delegateMethod('dispose')
    },
    delegateMethod (name, ...args) {
      if (!this.chart) {
        this.init()
      }
      return this.chart[name](...args)
    },
    delegateGet (name, method) {
      if (!this.chart) {
        this.init()
      }
      return this.chart[method]()
    },
    getArea () {
      return this.$el.offsetWidth * this.$el.offsetHeight
    },
    init () {
      if (this.chart) {
        return
      }
      let chart = echarts.init(this.$el, this.theme, this.initOptions)
      if (this.group) {
        chart.group = this.group
      }
      chart.setOption(this.manualOptions || this.options || {}, true)
      // 把 echarts 事件以自定义事件形式暴露出去
      EVENTS.forEach(event => {
        chart.on(event, params => {
          this.$emit(event, params)
        })
      })
      if (this.autoresize) {
        this.lastArea = this.getArea()
        this.__resizeHandler = debounce(() => {
          if (this.lastArea === 0) {
            // emulate initial render for initially hidden charts
            // ? 为什么需要先 this.mergeOptions({}, true)
            this.mergeOptions({}, true)
            this.resize()
            this.mergeOptions(this.options || this.manualOptions || {}, true)
          } else {
            this.resize()
          }
          this.lastArea = this.getArea()
        }, 100, { leading: true })
        addListener(this.$el, this.__resizeHandler)
      }
      Object.defineProperties(this, {
        // 只读属性，拦截了 getter 函数
        // Only recalculated when accessed from JavaScript.
        // Won't update DOM on value change because getters
        // don't depend on reactive values
        width: {
          configurable: true,
          get: () => {
            return this.delegateGet('width', 'getWidth')
          }
        },
        height: {
          configurable: true,
          get: () => {
            return this.delegateGet('height', 'getHeight')
          }
        },
        isDisposed: {
          configurable: true,
          get: () => {
            return !!this.delegateGet('isDisposed', 'isDisposed')
          }
        },
        computedOptions: {
          configurable: true,
          get: () => {
            return this.delegateGet('computedOptions', 'getOption')
          }
        }
      })
      this.chart = chart
    },
    destroy () {
      if (this.autoresize) {
        removeListener(this.$el, this.__resizeHandler)
      }
      this.dispose()
      this.chart = null
    },
    refresh () {
      if (this.chart) {
        this.destroy()
        this.init()
      }
    }
  },
  connect (group) {
    if (typeof group !== 'string') {
      group = group.map(chart => chart.chart)
    }
    echarts.connect(group)
  },
  disconnect (group) {
    echarts.disConnect(group)
  },
  registerMap (mapName, geoJSON, specialAreas) {
    echarts.registerMap(mapName, geoJSON, specialAreas)
  },
  registerTheme (name, theme) {
    echarts.registerTheme(name, theme)
  },
  graphic: echarts.graphic
}
</script>
