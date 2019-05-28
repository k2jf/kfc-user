import { Tooltip, Icon } from 'iview'
import D from 'dayjs'

export default [
  {
    title: '任务名称',
    key: 'taskName'
    // width: 240
  },
  {
    title: '项目名称',
    key: 'projectName'
    // width: 240
  },
  {
    title: '状态',
    width: 112,
    render: (h, params) => {
      const { status } = params.row
      switch (status) {
      case 0:
        return h('div',
          {
            'class': 'pl-2'
          },
          ['已创建'])
      case 1:
        return h('div',
          {
            'class': 'text-blue pl-2'
          },
          ['运行中'])
      case 2:
        return h('div',
          {
            'class': 'text-green pl-2'
          },
          ['成功'])
      case 3:
        return h('div', { 'class': 'text-red pl-2' }, [
          h(Tooltip, {
            props: {
              placement: 'top',
              content: params.row.message,
              maxWidth: 400
            }
          }, [
            h('span', ['失败']),
            ' ',
            h(Icon, {
              props: {
                type: 'ios-alert-outline'
              },
              class: 'text-sm',
              style: {
                verticalAlign: 'text-top'
              }
            })])
        ])
      }
    }
  },
  {
    title: '塔架高度(m)',
    key: 'towerHeight',
    width: 120,
    className: 'ido-table-number'
  },
  {
    title: '塔底直径(m)',
    key: 'bottomDiameter',
    width: 120,
    className: 'ido-table-number'
  },
  {
    title: '设计者',
    key: 'creator',
    width: 90
  },
  {
    title: '创建时间',
    key: 'createTime',
    render: (h, params) => {
      return h('div', [D(new Date(params.row.createTime)).format('YYYY-MM-DD HH:mm:ss')])
    },
    width: 160
  },
  {
    title: '备注',
    key: 'remark'
    // width: 100
  },
  {
    title: '操作',
    slot: 'operation',
    width: 180
  }
]
