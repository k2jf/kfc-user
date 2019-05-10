// import { _fetch } from '@/libs/fetch'

export default {
  namespaced: true,
  state: {
    geometry: {
      config: {}
    },
    seaState: {
      config: {}
    },
    geology: {
      config: {}
    }
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
    }
  },
  actions: {
    updateBaseInfo ({ commit }, payload) {

    }
  }
}
