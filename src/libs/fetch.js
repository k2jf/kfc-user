import ky from 'ky'

const requestMethods = [
  'get',
  'post',
  'put',
  'patch',
  'head',
  'delete'
]

export default {
  install: function (Vue, options) {
    Vue.prototype.$fetch = ky
    for (const method of requestMethods) {
      Vue.prototype[`$${method}`] = ky[method]
    }
  }
}
