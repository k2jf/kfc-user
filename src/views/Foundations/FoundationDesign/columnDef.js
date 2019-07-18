import { Tooltip, Icon } from 'iview'
import D from 'dayjs'
import { baseDictionary } from '@/config'

export default [
  {
    title: '任务名称',
    key: 'taskName',
    className: 'ido-less-padding',
    minWidth: 80
  },
  {
    title: '项目名称',
    key: 'projectName',
    className: 'ido-less-padding',
    minWidth: 80
  },
  {
    title: '状态',
    width: 92,
    className: 'ido-less-padding',
    render: (h, params) => {
      const { status } = params.row
      switch (status) {
      case 0:
        return h('div',
          {
            'class': ''
          },
          ['已创建'])
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
          ['成功'])
      case 3:
        return h('div', { 'class': 'text-red' }, [
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
      case 4:
        return h('div', { 'class': 'text-orange' }, [
          h(Tooltip, {
            props: {
              placement: 'top',
              content: params.row.message,
              maxWidth: 400
            }
          }, [
            h('span', ['校核未通过']),
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
    title: '任务类型',
    width: 80,
    className: 'ido-less-padding',
    render: (h, params) => {
      const { integratedDesign } = params.row
      const display = integratedDesign === 0 ? '分布式迭代' : '整体化设计'
      return h('div', [display])
    }
  },
  {
    title: '校核类型',
    minWidth: 80,
    className: 'ido-less-padding',
    render: (h, params) => {
      const { integratedDesign } = params.row
      let display = ''
      if (integratedDesign === 0) {
        const constraints = params.row.constraints || []
        display = constraints.filter(c => c.checked).map(c => baseDictionary[c.name]).join('，')
      } else {
        display = ['', '极限强度', '疲劳损伤'][integratedDesign]
      }
      return h('div', [display])
    }
  },
  {
    title: '基础形式',
    width: 60,
    className: 'ido-less-padding',
    render: (h, params) => {
      return h('div', [params.row.foundationForm === 1 ? '单桩' : '高桩'])
    }
  },
  {
    title: '桩径(m)',
    className: 'ido-less-padding',
    key: 'pileDiameter'
    // width: 80
  },
  {
    title: '天然泥面高程(m)',
    className: 'ido-less-padding',
    key: 'mudlineElevation'
  },
  {
    title: '设计阶段',
    className: 'ido-less-padding',
    render: (h, params) => {
      let text = ''
      if (params.row.designPhase === 'B') {
        text = '投标'
      } else if (params.row.designPhase === 'D') {
        text = '中标'
      }
      return h('span', [text])
    }
  },
  {
    title: '设计者',
    className: 'ido-less-padding',
    key: 'creator',
    width: 100
  },
  {
    title: '创建时间',
    className: 'ido-less-padding',
    key: 'createTime',
    render: (h, params) => {
      return h('div', [D(new Date(params.row.createTime)).format('YYYY-MM-DD HH:mm:ss')])
    },
    width: 132
  },
  {
    title: '操作',
    className: 'ido-less-padding',
    slot: 'operation',
    width: 256
  }
]
