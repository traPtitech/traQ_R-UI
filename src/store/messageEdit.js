import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    edited: ''
  },
  getters: {
    edited: state => {
      return state.edited
    }
  },
  mutations: {
    setEdited(state, { edited }) {
      state.edited = edited
    },
    addStampToEdited(state, { stampName }) {
      state.edited += `:${stampName}:`
    }
  }
}
