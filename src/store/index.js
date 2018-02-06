import Vue from 'vue'
import Vuex from 'vuex'

// import Channels from './channels'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appTitle: 'traQ',
    channelData: [
      {
        name: 'random',
        children: [
          {
            name: 'gamers',
            children: [
              {
                name: '1',
                children: []
              },
              {
                name: '2',
                children: []
              }
            ]
          },
          {
            name: 'progress',
            children: []
          }
        ]
      },
      {
        name: 'team',
        children: []
      }
    ]
  },
  mutations: {
  },
  getters: {
    getAppTitle: state => {
      return state.appTitle
    },
    getChannels: state => {
      return state.channelData
    }
  },
  actions: {
  },
  modules: {
  }
})
