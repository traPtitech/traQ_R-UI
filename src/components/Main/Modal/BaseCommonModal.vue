<template lang="pug">
.common-modal
  .common-modal-header-wrap
    .common-modal-header
      slot(name="header-icon")
      h1.common-modal-header-title {{ title }}
    .common-modal-close(@click="close")
      IconClose
  .common-modal-content
    slot
</template>

<script>
import { mapState, mapActions } from 'vuex'
import IconClose from '@/components/Icon/IconClose'
export default {
  components: {
    IconClose
  },
  props: {
    title: {
      type: String,
      default: 'MODAL'
    }
  },
  computed: {
    ...mapState('modal', ['data'])
  },
  methods: {
    ...mapActions('modal', ['close'])
  }
}
</script>

<style lang="sass">
.common-modal
    background: $background-color
    border-radius: $modal-border-radius
    width: 90vw
    max-width: 40rem
    height: min-content
.common-modal-header-wrap
    display: flex
    align-items: center
    justify-content: space-between
    padding: 1rem
.common-modal-header
    display: flex
    align-items: center
.common-modal-content
    padding: 1rem 0
    .message
      padding: 0.5rem 1rem
.common-modal-header-title
    color: $primary-color-on-bg
    margin: 0 1rem
    font:
        weight: 200
        size: 1.2rem
.common-modal-close
   cursor: pointer
</style>
