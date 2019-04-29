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

export const _ky = ky.extend({
  prefixUrl: baseUrl,
  retry: 0,
  timeout: 300000,
  throwHttpErrors: false
  // hooks: {
  //   afterResponse: [
  //     (res, silent) => {
  //       if (!res.ok && !silent) {
  //         Message.error(res.status + '')
  //       }
  //       return res
  //     }
  //   ]
  // }
})

export const _fetch = (input, options) => {
  return new Promise((resolve, reject) => {
    _ky(input, options)
      .then(res => res.json())
      .then(json => {
        if (json.code === 0) {
          resolve(json)
        } else {
          Message.error({
            content: json.message || '未知',
            closable: true
          })
          // throw new Error(json.message)
          reject(json.message)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default {
  install: function (Vue, options) {
    Vue.prototype.$ky = _ky
    Vue.prototype.$fetch = _fetch
    for (const method of requestMethods) {
      Vue.prototype[`$${method}`] = (input, options) => _fetch(input, { method, ...options })
    }
  }
}
