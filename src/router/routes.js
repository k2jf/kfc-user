import Main from '@/components/Main'

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录'
    },
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login')
  },
  {
    path: '/',
    name: 'index',
    redirect: '/projects',
    component: Main,
    children: [
      {
        path: '/projects',
        // name: 'projects',
        meta: {
          breadName: '项目列表'
        },
        component: () => import(/* webpackChunkName: "Projects" */ '@/views/Projects'),
        children: [
          {
            path: '',
            name: 'projects',
            meta: {
              breadName: '项目列表',
              ignore: true
            },
            component: () => import(/* webpackChunkName: "Projects" */ '@/views/Projects/ProjectList')
          },
          {
            path: ':projectId',
            name: 'project-info',
            meta: {
              breadName: '项目详情'
            },
            component: () => import(/* webpackChunkName: "Projects" */ '@/views/Projects/ProjectItem')
          }
        ]
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
            component: () => import(/* webpackChunkName: "Towers" */ '@/views/Towers/TowerDesign')
          },
          {
            path: 'new-tower-design/:taskId',
            name: 'new-tower-design',
            meta: {
              breadName: '编辑塔架任务'
            },
            component: () => import(/* webpackChunkName: "Towers" */ '@/views/Towers/TowerInfo')
          },
          {
            path: 'tower-result/:taskId',
            name: 'tower-result',
            meta: {
              breadName: '塔架任务结果'
            },
            component: () => import(/* webpackChunkName: "Towers" */ '@/views/Towers/TowerResult')
          }
        ]
      },
      {
        path: '/basics',
        meta: {
          breadName: '基础设计任务列表'
        },
        component: () => import(/* webpackChunkName: "Basics" */ '@/views/Basics'),
        children: [
          {
            path: '',
            name: 'basics',
            meta: {
              breadName: '基础设计任务列表',
              ignore: true
            },
            component: () => import(/* webpackChunkName: "Basics" */ '@/views/Basics/BasicDesign')
          },
          {
            path: 'new-basic-design/:basicId',
            name: 'new-basic-design',
            meta: {
              breadName: '编辑基础任务'
            },
            component: () => import(/* webpackChunkName: "Basics" */ '@/views/Basics/BasicInfo')
          }
        ]
      },
      {
        path: '/data-analytics',
        name: 'data-analytics',
        meta: {
          breadName: '数据分析'
        },
        component: () => import(/* webpackChunkName: "Analytics" */ '@/views/DataAnalytics')
      },
      {
        path: '/data-management',
        name: 'data-management',
        meta: {
          breadName: '数据管理'
        },
        component: () => import(/* webpackChunkName: "Managements" */ '@/views/Management')
      },
      {
        path: '/users',
        name: 'users',
        meta: {
          breadName: '用户管理'
        },
        component: () => import(/* webpackChunkName: "Users" */ '@/views/Users')
      }
    ]
  }
]
