import traQRTCClient from '@/bin/rtc.js'

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
  mutations: {},
  actions: {
    async establishConnection({ state }) {
      if (state.client) {
        return
      }
      state.client = new traQRTCClient('poyo')
      await state.client.establishConnection()
    },
    async joinRoom({ state }, room) {
      await state.client.joinRoom(room)
    },
    async setStream() {},
    async sendData() {}
  }
}
