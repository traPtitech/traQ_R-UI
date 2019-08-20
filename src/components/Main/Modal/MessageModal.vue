<template lang="pug">
base-common-modal(title="MESSAGE" small scroll)
  icon-pin(color="var(--primary-color-on-bg)" slot="header-icon" size="24")
  .message-item
    message-element(:model="message")
</template>

<script>
import { mapState } from 'vuex'
import MessageElement from '@/components/Main/MessageView/MessageElement/MessageElement'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import IconPin from '@/components/Icon/IconPin'

export default {
  name: 'MessageModal',
  components: {
    MessageElement,
    BaseCommonModal,
    IconPin
  },
  computed: {
    ...mapState('modal', ['data']),
    message() {
      const pinned = this.$store.state.currentChannelPinnedMessages.find(
        ({ message }) => message.messageId === this.data.messageId
      )
      return pinned ? pinned.message : this.data
    }
  }
}
</script>

<style lang="sass">
.message-item
  padding: -1rem
</style>
