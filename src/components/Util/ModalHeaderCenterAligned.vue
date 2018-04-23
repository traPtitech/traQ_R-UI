<template lang="pug">
div.modal-header-center-aligned
  div.modal-header-container
    div.modal-header-icon-wrapper
      div.fas(v-if="faIconName", :class="faClassName")
    div.modal-header-title {{ title }}
</template>

<script>
export default {
  name: 'ModalHeaderCenterAligned',
  props: {
    title: String,
    faIconName: {
      type: String,
      default: null
    }
  },
  computed: {
    faClassName () {
      return (this.faIconName.startsWith('fa-') ? '' : 'fa-') + this.faIconName
    }
  }
}
</script>

<style lang="sass">
.modal-header-center-aligned
  width: 100%
  max-width: 80vw
  display: flex
  justify-content: center
  align-items: center
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1)

.modal-header-container
  max-width: 100%
  display: grid
  grid-template-columns: 2rem 1fr
  grid-gap: 1rem
  margin: 0px 1.5rem
  color: gray
  font-size: 1.5rem
  align-items: center
  justify-itms: center
  .modal-header-title
    width: 100%
    max-width: calc(80vw - 5.5rem)
    margin: 0.5rem 0px
    overflow-wrap: break-word
</style>
