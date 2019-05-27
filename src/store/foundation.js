// import { _fetch } from '@/libs/fetch'

export default {
  namespaced: true,
  state: {
    geometry: {
    },
    seaState: {
      config: {}
    },
    geology: {
      config: {}
    },
    towerId: -1,
    hasFatigue: false,
    form: 1
  },
  mutations: {
    syncGeometry (state, payload) {
      state.geometry = Object.assign({}, state.geometry, payload)
    },
    syncSeaState (state, payload) {
      state.seaState = Object.assign({}, state.seaState, payload)
    },
    syncGeology (state, payload) {
      state.geology = Object.assign({}, state.geology, payload)
    },
    syncTowerId (state, payload) {
      state.towerId = payload.towerId
    },
    syncFatigue (state, payload) {
      state.hasFatigue = payload.hasFatigue
    },
    syncForm (state, payload) {
      state.form = payload
    }
  },
  actions: {
    updateBaseInfo ({ commit }, payload) {

    }
  }
}
