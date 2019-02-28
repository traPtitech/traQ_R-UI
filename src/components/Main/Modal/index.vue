<template lang="pug">
div.modal-overlay(v-if="isActive" @click.self="close")
  component.modal(:is="name")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import UserModal from './UserModal'
import GroupModal from './GroupModal'
import TagModal from './TagModal'
import PinnedModal from './PinnedModal'
import FileModal from './FileModal'
import ChannelCreateModal from './ChannelCreateModal'
import ChannelNotificationModal from './ChannelNotificationModal'

export default {
  name: 'Modal',
  components: {
    UserModal,
    GroupModal,
    TagModal,
    PinnedModal,
    FileModal,
    ChannelCreateModal,
    ChannelNotificationModal
  },
  computed: {
    ...mapState('modal', ['name']),
    ...mapGetters('modal', ['isActive'])
  },
  methods: {
    ...mapActions('modal', ['close'])
  }
}
</script>

<style lang="sass">
.modal
  border-radius: $modal-border-radius
  width: $modal-width
  max-width: $modal-max-width
  +mq
    width: $modal-width--wide
  height: $modal-height
  position: relative
  background-color: $background-color
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.4)
.modal-overlay
  z-index: $modal-index
  position: fixed
  width: 100vw
  height: 100vh
  top: 0
  left: 0
  display: flex
  justify-content: center
  align-items: center
  cursor: auto
  background-color: rgba(0, 0, 0, 0.2)
  animation: fadeIn .2s ease

@keyframes fadeIn
  0%
    opacity: 0
  100%
    opacity: 1
</style>
