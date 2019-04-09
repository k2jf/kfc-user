
export default [
  {
    title: '变量名',
    key: 'variableName'
  },
  {
    title: '单位',
    key: 'unit'
  },
  // {
  //   title: '迭代方式',
  //   key: 'hhh',
  //   render: (h, params) => {
  //     const self = this
  //     console.log(self, params.hhh)
  //     return h('iSelect', {
  //       domProps: {
  //         value: params.hhh
  //       },
  //       on: {
  //         input: (event) => {
  //           self.$emit('input', event.target.value)
  //         }
  //       }
  //     }, [
  //       h('iOption', {
  //         props: {
  //           value: 'continuous'
  //         }
  //       }, ['连续'])
  //     ])
  //   }
  // },
  {
    title: '迭代参数',
    slot: 'mode'
  },
  {
    title: '配置',
    slot: 'config',
    width: 360
  }
]
