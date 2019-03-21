import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/views/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/projects'
    },
    {
      path: '/projects',
      name: 'projects',
      meta: {
        breadName: '项目列表'
      },
      component: () => import(/* webpackChunkName: "projects" */ '@/views/Projects')
    },
    {
      path: '/towers',
      // name: 'towers',
      meta: {
        breadName: '塔架设计任务列表'
      },
      component: () => import(/* webpackChunkName: "Towers" */ '@/views/Towers'),
      children: [
        {
          path: '',
          name: 'towers',
          meta: {
            breadName: '塔架设计任务列表',
            // while navigate to "/towers", routes matches both "/towers" and "/towers/",
            // but breadcrumb should only show meta info of first matched route,
            // in this case is { breadName: '项目列表' } of "/towers",
            // therefore use a flag called ignore to filte "/towers/" route.
            // NEED TO DO: MAY BE THERE IS A BETTER WAY
            ignore: true
          },
          component: () => import(/* webpackChunkName: "Towers" */ '@/views/TowerDesign')
        },
        {
          path: 'new-tower-design',
          name: 'new-tower-design',
          meta: {
            breadName: '创建任务'
          },
          component: () => import(/* webpackChunkName: "Towers" */ '@/views/TowerInfo')
        }
      ]
    },
    {
      path: '/basic',
      name: 'basic',
      meta: {
        breadName: '基础设计'
      },
      component: () => import(/* webpackChunkName: "projects" */ '@/views/BasicDesign')
    },
    {
      path: '/data-analytics',
      name: 'data-analytics',
      meta: {
        breadName: '数据分析'
      },
      component: () => import(/* webpackChunkName: "projects" */ '@/views/DataAnalytics')
    },
    {
      path: '/data-management',
      name: 'data-management',
      meta: {
        breadName: '数据管理'
      },
      component: () => import(/* webpackChunkName: "projects" */ '@/views/Management')
    },
    {
      path: '/users',
      name: 'users',
      meta: {
        breadName: '用户管理'
      },
      component: () => import(/* webpackChunkName: "projects" */ '@/views/Users')
    }
  ]
})
