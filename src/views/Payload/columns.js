import D from 'dayjs'

export default [
  {
    title: '载荷编码',
    key: 'code',
    minWidth: 120
  },
  {
    title: '项目名称',
    key: 'projectName',
    minWidth: 80
  },
  {
    title: '基础型式',
    // key: 'foundationForm',
    render: (h, params) => {
      return h('div', [params.row.foundationForm === 1 ? '单桩' : '高桩'])
    },
    minWidth: 80
  },
  {
    title: '塔底直径(m)',
    key: 'towerBottomD',
    minWidth: 80
  },
  {
    title: '载荷文件名称',
    key: 'ultimateFile',
    minWidth: 80
  },
  {
    title: '设计者',
    key: 'designer',
    minWidth: 80
  },
  {
    title: '上传时间',
    render: (h, params) => {
      return h('div', [D(new Date(params.row.createTime)).format('YYYY-MM-DD HH:mm:ss')])
    },
    width: 160
  },
  {
    title: '备注',
    key: 'remark',
    minWidth: 80
  },
  {
    title: '操作',
    slot: 'operation',
    width: 100
  }
]
