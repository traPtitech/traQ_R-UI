<template lang="pug">
.common-modal(:data-is-small="small" :data-is-tiny="tiny")
  .common-modal-header-wrap
    .common-modal-header(:class="{'common-modal-header-back': enableBack}" @click="handleHeaderClick")
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
    },
    tiny: {
      type: Boolean,
      defualt: null
    },
    enableBack: {
      // enable "back to user modal" when header is clicked
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState('modal', ['data'])
  },
  methods: {
    ...mapActions('modal', ['close']),
    handleHeaderClick () {
      if (this.enableBack) {
        this.$store.dispatch('openUserModal', this.$store.state.modal.lastUser.userId)
      }
    }
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
    max-height: 80vh
.common-modal[data-is-tiny="true"]
    max-width: 25rem
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
.common-modal-close, .common-modal-header-back
   cursor: pointer
</style>
