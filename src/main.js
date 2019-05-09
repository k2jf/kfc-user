import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fetch from './libs/fetch'
import { Select, Option, Message } from 'iview'
import '@/plugins/echarts'
import _ from 'lodash'

import './index.css'
import 'iview/dist/styles/iview.css'
import 'dayjs/locale/zh-cn'

Vue.config.productionTip = false

Vue.use(fetch)

// TODO move to plugins/xx
Vue.component('iSelect', Select)
Vue.component('iOption', Option)
Vue.prototype.$Message = Message
Vue.prototype.$Message.config({
  duration: 5
})

// lodash
Vue.prototype._ = _

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
