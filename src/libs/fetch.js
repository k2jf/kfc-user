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
    const api = ky.extend({
      prefixUrl: baseUrl,
      hooks: {
        // beforeRequest: [
        //   req => {
        //     console.log(req)
        //     return req
        //   }
        // ],
        afterResponse: [
          res => {
            console.log(res)
            // switch (res.status) {
            // case 404:
            //   Message.error('404')
            // }
            if (!res.ok) {
              Message.error('error')
            }
            return res
          }
        ]
      } })
    Vue.prototype.$fetch = api
    for (const method of requestMethods) {
      Vue.prototype[`$${method}`] = api[method]
    }
  }
}
