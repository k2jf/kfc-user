import { Tooltip } from 'iview'
import D from 'dayjs'
import { baseDictionary } from '@/config'

export default [
  {
    title: '任务名称',
    key: 'taskName'
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
    title: '校核类型',
    render: (h, params) => {
      const constraints = params.row.constraints || []
      const display = constraints.filter(c => c.checked).map(c => baseDictionary[c.name]).join('，')
      return h('div', [display])
    }
  },
  {
    title: '基础形式',
    render: (h, params) => {
      return h('div', [params.row.foundationForm === 1 ? '单桩' : '高桩'])
    }
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
    title: '操作',
    slot: 'operation',
    width: 170
  }
]
