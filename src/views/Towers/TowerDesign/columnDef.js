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
    key: 'status'
  },
  {
    title: '塔架高度',
    key: 'towerHeight'
  },
  {
    title: '塔底直径',
    key: 'bottomDiameter'
  },
  {
    title: '创建时间',
    key: 'createTime',
    render: (h, params) => {
      return h('div', [
        h(Tooltip, {
          props: {
            placement: 'top',
            content: D(params.row.createTime).format('YYYY-MM-DD hh:mm:ss')
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
