<template lang="pug">
BaseCommonModal(title="PINNED" small)
  IconPin(color="var(--primary-color-on-bg)" slot="header-icon" :size="24")
  .message-item
    MessageElement(:model="data")
</template>

<script>
import { mapState } from 'vuex'
import MessageElement from '@/components/Main/MessageView/MessageElement/MessageElement'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import IconPin from '@/components/Icon/IconPin'

export default {
  name: 'PinnedModal',
  components: {
    MessageElement,
    BaseCommonModal,
    IconPin
  },
  computed: {
    ...mapState('modal', ['data'])
  }
}
</script>

<style lang="sass">
</style>
