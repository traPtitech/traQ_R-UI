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
  background:
    color: var(--white-on-primary)
  border-radius: 4px
  cursor: pointer
  transition: background .2s ease, box-shadow .5s ease

  &:hover
    background:
      color: var(--white-on-primary-hovered)

  &.is-active
    background:
      color: var(--white-on-primary-active)
</style>
