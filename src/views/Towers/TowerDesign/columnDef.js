import { Tooltip } from 'iview'
import D from 'dayjs'

export default [
  {
    title: '任务名称',
    key: 'taskName',
    width: 240
  },
  {
    title: '项目名称',
    key: 'projectName'
  },
  {
    title: '状态',
    render: (h, params) => {
      const { status } = params.row
      switch (status) {
      case 0:
        return h('div', ['已创建'])
      case 1:
        return h('div',
          {
            'class': 'text-blue'
          },
          ['运行中'])
      case 2:
        return h('div',
          {
            'class': 'text-green'
          },
          ['运行成功'])
      case 3:
        return h('div',
          {
            'class': 'text-red'
          },
          ['运行失败'])
      }
    }
  },
  {
    title: '塔架高度',
    key: 'towerHeight',
    width: 90,
    className: 'ido-table-number'
  },
  {
    title: '塔底直径',
    key: 'bottomDiameter',
    width: 90,
    className: 'ido-table-number'
  },
  {
    title: '设计者',
    key: 'designer'
  },
  {
    title: '创建时间',
    key: 'createTime',
    render: (h, params) => {
      return h('div', [
        h(Tooltip, {
          props: {
            placement: 'top',
            content: D(new Date(params.row.createTime)).format('YYYY-MM-DD HH:mm:ss')
          }
        }, [D(params.row.createTime).format('YYYY-MM-DD')])
      ])
    },
    width: 100
  },
  {
    title: '备注',
    key: 'remark'
  },
  {
    title: '操作',
    slot: 'operation',
    width: 180
  }
]
