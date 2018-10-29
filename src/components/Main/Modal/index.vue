<template lang="pug">
div.modal-overlay(v-if="isActive" @click="close")
  component.modal(:is="name")
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import UserModal from './UserModal'
import TagModal from './TagModal'

export default {
  name: 'Modal',
  components: {
    UserModal,
    TagModal
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
  +mq
    width: $modal-width--wide
  display: grid
  height: $modal-height
  position: relative
  background-color: $background-color
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.4)
.modal-overlay
  z-index: $modal-index
  position: fixed
  width: 100%
  height: 100%
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
