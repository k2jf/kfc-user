import { _fetch } from '@/libs/fetch'

export default {
  namespaced: true,
  state: {
    results: {},
    adjustOptResult: {}
  },
  getters: {
    constraints (state) {
      return state.results.Constraints || []
    }
  },
  mutations: {
    syncResults (state, payload) {
      state.results = payload.results
    },
    syncAdjustOptResult (state, payload) {
      state.adjustOptResult = payload.adjustOptResult
    }
  },
  actions: {
    async getResults ({ commit }, payload) {
      commit('syncLoading', { loading: true }, { root: true })
      const { towerId } = payload
      try {
        const res = await _fetch(`towerTasks/${towerId}/result`, { method: 'get' })
        commit('syncResults', { results: res.body })
        commit('syncAdjustOptResult', { adjustOptResult: res.body.optResult })
        commit('syncLoading', { loading: false }, { root: true })
      } catch (error) {
        commit('syncLoading', { loading: false }, { root: true })
      }
    },
    async getAdjustOptResult ({ commit }, payload) {
      commit('syncLoading', { loading: true }, { root: true })
      const { towerId, thicknessList } = payload
      try {
        const res = await _fetch(`towerTasks/${towerId}/codeAdjust`, { method: 'post', json: thicknessList, silent: true })
        commit('syncAdjustOptResult', { adjustOptResult: res.body })
        commit('syncLoading', { loading: false }, { root: true })
      } catch (err) {
        // if (typeof err === 'string') {
        //   Message
        // }
        commit('syncLoading', { loading: false }, { root: true })
      }
    }
  }
}
