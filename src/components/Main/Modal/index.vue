<template lang="pug">
div.modal-overlay(v-if="isActive" :style="overlayStyle" @click.self="close")
  component.modal(:is="name" @opacityChange="handleOpacityChange")
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
  data() {
    return {
      overlayOpacity: 0.2,
      defaultOverlayOpacity: 0.2
    }
  },
  computed: {
    ...mapState('modal', ['name']),
    ...mapGetters('modal', ['isActive']),
    overlayStyle() {
      return {
        background: `rgba(0, 0, 0, ${this.overlayOpacity})`
      }
    }
  },
  methods: {
    ...mapActions('modal', ['close']),
    handleOpacityChange(opacity) {
      this.overlayOpacity = opacity >= 0 ? opacity : this.defaultOverlayOpacity
    }
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
  height: 100%
  top: 0
  left: 0
  display: flex
  justify-content: center
  align-items: center
  cursor: auto
  animation: fadeIn .2s ease

@keyframes fadeIn
  0%
    opacity: 0
  100%
    opacity: 1
</style>
