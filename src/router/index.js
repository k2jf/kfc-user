import Vue from 'vue'
import routes from './routes'
import store from '@/store'
import Router from 'vue-router'
// import { Message } from 'iview'

Vue.use(Router)

const router = new Router({
  routes,
  mode: 'hash',
  base: process.env.BASE_URL
})

const LOGIN_PAGE_NAME = 'login'
const HOME_PAFE_NAME = 'index'

router.beforeEach((to, from, next) => {
  const userName = store.state.userName
  if (!userName && to.name !== LOGIN_PAGE_NAME) {
    // Message.info('请先登录')
    next({ name: LOGIN_PAGE_NAME })
  } else if (!userName && to.name === LOGIN_PAGE_NAME) {
    next()
  } else if (userName && to.name === LOGIN_PAGE_NAME) {
    next({ name: HOME_PAFE_NAME })
  }
  next()
})

export default router
