import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fetch from './libs/fetch'
import { Select, Option } from 'iview'

import './index.css'
import 'iview/dist/styles/iview.css'
import 'dayjs/locale/zh-cn'

Vue.config.productionTip = false

Vue.use(fetch)
Vue.component('iSelect', Select)
Vue.component('iOption', Option)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
