import { baseConfig } from '@/config'
import { _fetch } from '@/libs/fetch'

export default {
  namespaced: true,
  state: {
    baseInfo: {

    },
    constraints: baseConfig,
    geometry: [],
    seaState: [],
    geology: []
  },
  mutations: {
    syncBaseInfo (state, payload) {
      state.baseInfo = {
        ...state.baseInfo,
        ...payload
      }
    },
    syncConstraints (state, payload) {
      state.constraints = payload.constraints
    },
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
    updateBaseInfo ({ commit, state }, payload) {

    }
  }
}
