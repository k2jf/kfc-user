import Vue from 'vue'
import Vuex from 'vuex'

import foundation from './foundation'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userName: ''
  },
  getters: {
    localStorageUserName: state => {
      let name = state.userName
      if (!name) {
        name = localStorage.getItem('ido') || ''
        state.userName = name
      }
      return name
    }
  },
  mutations: {
    setUserName (state, name) {
      state.userName = name
      localStorage.setItem('ido', name)
    }
  },
  actions: {

  },
  modules: {
    foundation
  }
})
