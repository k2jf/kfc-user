import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fetch from './libs/fetch'

import './index.css'
import 'iview/dist/styles/iview.css'
import 'dayjs/locale/zh-cn'

Vue.config.productionTip = false

Vue.use(fetch)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
