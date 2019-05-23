import traQRTCClient from '@/bin/rtc'

export default {
  namespaced: true,
  state: {
    /**
     * @property {traQRTCClient} client RTC Client
     */
    client: null,
    activeVoiceChannelId: ''
  },
  getters: {},
  mutations: {
    setClient(state, data) {
      state.client = data
    }
  },
  actions: {
    async establishConnection({ state, commit, rootState }) {
      if (state.client) {
        return
      }
      commit('setClient', new traQRTCClient(rootState.me.name))
      try {
        await state.client.establishConnection()
      } catch {
        commit('setClient', null)
      }
    },
    async joinRoom({ state }, room) {
      await state.client.joinRoom(room)
    },
    async setStream() {},
    async sendData() {}
  }
}
