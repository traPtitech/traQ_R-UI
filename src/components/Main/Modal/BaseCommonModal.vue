<template lang="pug">
.common-modal(:data-is-small="small")
  .common-modal-header-wrap
    .common-modal-header
      slot(name="header-icon")
      h1.common-modal-header-title {{ title }}
    .common-modal-close(@click="close")
      icon-close(color="var(--primary-color-on-bg)" :size="12")
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
    },
    small: {
      type: Boolean,
      defualt: null
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
    max-width: 60rem
    width: 90vw
    height: min-content
    padding: 1rem
.common-modal[data-is-small="true"]
    max-width: 40rem
.common-modal-header-wrap
    display: flex
    align-items: center
    justify-content: space-between
    padding: 0 0.5rem
    margin-bottom: 2rem
.common-modal-header
    display: flex
    align-items: center
.common-modal-content
    .message
      padding: 0.5rem 1.5rem
    .message-pinned
      background: none
    .message-pinned:hover
      background: $background-hover-color
.common-modal-header-title
    color: $primary-color-on-bg
    margin: 0 1rem
    font:
        weight: 200
        size: 1.2rem
.common-modal-close
   cursor: pointer
</style>
