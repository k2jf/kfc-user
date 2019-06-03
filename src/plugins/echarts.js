import Vue from 'vue'
import Echarts from 'vue-echarts'
// import 'echarts-liquidfill'

import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/lines'
import 'echarts/lib/chart/scatter'

import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/axis'
import 'echarts/lib/component/graphic'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/axisPointer'
import 'echarts/lib/component/markLine'

Vue.component('Chart', Echarts)
