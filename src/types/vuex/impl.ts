import 'vuex'
import * as Root from '../../store/general/type'
import * as MessageInput from '../../store/messageInput/type'
import * as Modal from '../../store/modal/type'
import * as PickerModal from '../../store/PickerModal/type'

declare module 'vuex' {
  type RootState = Root.S & {
    general: Root.S
    messageInput: MessageInput.S
    modal: Modal.S
    pickerModal: PickerModal.S
  }
  type RootGetters = Root.RG & MessageInput.RG & Modal.RG & PickerModal.RG
  type RootMutations = Root.RM & MessageInput.RM & Modal.RM & PickerModal.RM
  type RootActions = Root.RA & MessageInput.RA & Modal.RA & PickerModal.RA
}
