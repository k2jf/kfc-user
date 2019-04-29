import { _fetch } from '@/libs/fetch'

export default {
  namespaced: true,
  state: {
    geometry: {},
    seaState: {},
    geology: {}
  },
  mutations: {
    syncGeometry (state, payload) {
      state.geometry = payload.geometry
    },
    syncSeaState (state, payload) {
      state.seaState = payload.seaState
    },
    syncGeology (state, payload) {
      state.geology = payload.geology
    }
  },
  actions: {
    updateBaseInfo ({ commit }, payload) {

    }
  }
}
