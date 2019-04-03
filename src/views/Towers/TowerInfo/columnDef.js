import { Tooltip, Select, Option } from 'iview'
import D from 'dayjs'

export default [
  {
    title: '变量名',
    key: 'variableName'
  },
  {
    title: '单位',
    key: 'unit'
  },
  {
    title: '迭代方式',
    key: 'hhh',
    render: (h, params) => {
      const self = this
      return h('div', {
        components: { Select, Option },
      }, [
          h(Select, {
          props: {
            value: 'continuous'
          },
          on: {
            input: (event) => {
              self.$emit('input', event.target.value)
            }
          }
        }, [
              h(Option, {
              Props: {
                value: 'continuous'
              }
            }, ['连续'])
          ])
      ])
    }
  },
  {
    title: '配置',
    key: 'config'
  }
]
