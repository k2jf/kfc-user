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
  const userName = store.getters.localStorageUserName
  if (!userName && to.name !== LOGIN_PAGE_NAME) {
    // console.log('没有用户名，不是去登录页')
    // Message.info('请先登录')
    next({ name: LOGIN_PAGE_NAME })
  } else if (!userName && to.name === LOGIN_PAGE_NAME) {
    // console.log('去登录页')
    next()
  } else if (userName && to.name === LOGIN_PAGE_NAME) {
    // console.log('有用户名，去登录页')
    next({ name: HOME_PAFE_NAME })
  } else {
    // console.log('有用户名')
    next()
  }
})

export default router
