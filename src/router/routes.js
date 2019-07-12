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
        path: '/payloads',
        name: 'payloads',
        meta: {
          breadName: '载荷版本管理'
        },
        component: () => import(/* webpackChunkName: "Payload" */ '@/views/Payload')
      },
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
            path: 'tower-design/:taskId',
            name: 'tower-design',
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
        path: '/foundations',
        meta: {
          breadName: '基础设计任务列表'
        },
        component: () => import(/* webpackChunkName: "Foundations" */ '@/views/Foundations'),
        children: [
          {
            path: '',
            name: 'foundations',
            meta: {
              breadName: '基础设计任务列表',
              ignore: true
            },
            component: () => import(/* webpackChunkName: "Foundations" */ '@/views/Foundations/FoundationDesign')
          },
          {
            path: 'foundation-design/:foundationId',
            name: 'foundation-design',
            meta: {
              breadName: '编辑基础任务'
            },
            component: () => import(/* webpackChunkName: "Foundations" */ '@/views/Foundations/FoundationInfo')
          },
          {
            path: 'foundation-result/:foundationId',
            name: 'foundation-result',
            meta: {
              breadName: '基础任务结果'
            },
            component: () => import(/* webpackChunkName: "Foundations" */ '@/views/Foundations/FoundationResult')
          },
          {
            path: 'integrated-design/:foundationId',
            name: 'integrated-design',
            meta: {
              breadName: '编辑基础任务'
            },
            component: () => import(/* webpackChunkName: "Foundations" */ '@/views/Foundations/IntegratedDesignInfo')
          },
          {
            path: 'integrated-result/:foundationId',
            name: 'integrated-result',
            meta: {
              breadName: '基础任务结果'
            },
            component: () => import(/* webpackChunkName: "Foundations" */ '@/views/Foundations/IntegratedDesignResult')
          }
        ]
      },
      {
        path: '/analytics',
        name: 'analytics',
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
