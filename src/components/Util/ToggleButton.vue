<template lang="pug">
  .toggle-button-body.flex-center(@click="toggle" :class="toggleButtonClass")
    slot
</template>

<script>
export default {
  name: 'ToggleButton',
  model: {
    prop: 'isActive',
    event: 'change'
  },
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toggle() {
      this.$emit('change', !this.isActive)
    }
  },
  computed: {
    toggleButtonClass() {
      return {
        'is-active': this.isActive
      }
    }
  }
}
</script>

<style lang="sass">
.toggle-button-body
  height: 32px
  width: 32px
  background: rgba(255,255,255,0.2)
  border-radius: 4px
  cursor: pointer
  transition: background .2s ease

  &:hover
    background: rgba(255,255,255,0.3)

  &.is-active
    background: rgba(255,255,255,0.7)
</style>
