import Vue from 'vue'
import Vuex, { Store, RootState, ExStore } from 'vuex'

import general from './general'
import modal from './modal'
import messageInput from './messageInput'
import pickerModal from './pickerModal'

Vue.use(Vuex)

const store: ExStore = new Store<RootState>({
  ...general,
  modules: {
    modal,
    messageInput,
    pickerModal
  }
} as any)

interface Window {
  openUserModal: (string) => void
  openGroupModal: (string) => void
}
declare var window: Window

window.openUserModal = userId => {
  store.dispatch('modal/openUserModal', userId)
}

window.openGroupModal = groupId => {
  store.dispatch('modal/openGroupModal', groupId)
}

export default store
