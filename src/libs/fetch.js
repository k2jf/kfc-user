import ky from './ky'
import { Message } from 'iview'
import { baseUrl } from '@/config'

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
    const _ky = ky.extend({
      prefixUrl: baseUrl,
      retry: 0,
      hooks: {
        afterResponse: [
          res => {
            if (!res.ok) {
              console.log(res)
              Message.error(res.status + '')
            }
            return res
          }
        ]
      }
    })

    const _fetch = (input, options) => {
      return new Promise((resolve, reject) => {
        _ky(input, options)
          .then(res => res.json())
          .then(json => {
            if (json.code === 0) {
              resolve(json)
            } else {
              Message.error(json.message || '未知')
              reject(json.message)
            }
          })
      })
    }

    Vue.prototype.$ky = _ky
    Vue.prototype.$fetch = _fetch
    for (const method of requestMethods) {
      Vue.prototype[`$${method}`] = (input, options) => _fetch(input, { method, ...options })
    }
  }
}
