import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    url: 'https://traq-dev.herokuapp.com'
  },
  mutations: {
    setUrl (state, newUrl) { state.url = newUrl }
  },
  getters: {
    url (state) { return state.url }
  }
})
