<template lang="pug">
base-common-modal(title="MESSAGE" small scroll)
  icon-pin(color="var(--primary-color-on-bg)" slot="header-icon" size="24")
  .message-item(ref="container")
    message-element(:model="message")
</template>

<script>
import { mapState } from 'vuex'
import { toggleSpoiler } from '@/bin/markdown'
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
  },
  mounted() {
    this.$refs.container.addEventListener('click', toggleSpoiler)
  },
  beforeDestroy() {
    this.$refs.container.removeEventListener('click', toggleSpoiler)
  }
}
</script>

<style lang="sass">
.message-item
  padding: -1rem
  contain: layout
</style>
