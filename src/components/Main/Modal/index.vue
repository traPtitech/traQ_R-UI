<template lang="pug">
.modal-container(v-if="isActive")
  .modal-overlay(
    :style="overlayStyle"
    @click.self="close"
  )
  component.modal(
    :is="name"
    @opacity-change="handleOpacityChange"
    @fadeout-start="handleFadeoutStart"
  )
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import UserModal from './UserModal'
import GroupModal from './GroupModal'
import TagModal from './TagModal'
import MessageModal from './MessageModal'
import FileModal from './FileModal'
import TourModal from './TourModal'
import CodeModal from './CodeModal'
import ChannelCreateModal from './ChannelCreateModal'
import ChannelNotificationModal from './ChannelNotificationModal'

export default {
  name: 'Modal',
  components: {
    UserModal,
    GroupModal,
    TagModal,
    MessageModal,
    FileModal,
    TourModal,
    CodeModal,
    ChannelCreateModal,
    ChannelNotificationModal
  },
  data() {
    return {
      overlayOpacity: 0.2,
      defaultOverlayOpacity: 0.2,
      isOnFadeout: false,
      containerOpacityChangingDuration: 2000
    }
  },
  computed: {
    ...mapState('modal', ['name']),
    ...mapGetters('modal', ['isActive']),
    overlayStyle() {
      return {
        opacity: this.overlayOpacity
      }
    },
    containerStyle() {
      return {
        opacity: this.containerOpacity,
        transition: `opacity ${this.containerOpacityChangingDuration /
          1000}s ease`
      }
    }
  },
  methods: {
    ...mapActions('modal', ['close']),
    handleOpacityChange(opacity) {
      this.overlayOpacity = opacity >= 0 ? opacity : this.defaultOverlayOpacity
    },
    async handleFadeoutStart(duration) {
      this.containerOpacityChangingDuration = duration
      this.isOnFadeout = true
      this.containerOpacity = 0
    }
  }
}
</script>

<style lang="sass">
.modal
  border-radius: $modal-border-radius
  width: $modal-width
  max-width: $modal-max-width
  +mq(pc)
    width: $modal-width--wide
  max-height: $modal-height
  position: relative
  background-color: $background-color
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.4)
  +mq(sp)
    max-height: 90vh

.modal-container
  z-index: $modal-index
  position: fixed
  width: 100vw
  height: 100%
  top: 0
  left: 0
  display: flex
  justify-content: center
  align-items: center
  animation: fadeIn .2s ease
  contain: strict

.modal-overlay
  position: fixed
  background: black
  opacity: 0
  width: 100vw
  height: 100%
  top: 0
  left: 0
  display: flex
  justify-content: center
  align-items: center
  cursor: auto

@keyframes fadeIn
  0%
    opacity: 0
  100%
    opacity: 1
</style>
