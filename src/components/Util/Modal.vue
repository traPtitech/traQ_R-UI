<template lang="pug">
div.modal-overlay(v-if="active" @click="$emit('close')")
  div.modal(@click.stop="")
    slot
</template>

<script>
export default {
  name: 'Modal',
  props: {
    active: Boolean
  },
  created: function () {
  },
  methods: {
  }
}
</script>

<style lang="sass">
.modal
  position: absolute
  z-index: 101
  background-color: #f5f5f5
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.25)
.modal-overlay
  position: fixed
  z-index: 100
  width: 100%
  height: 100%
  top: 0
  left: 0
  display: flex
  justify-content: center
  align-items: center
  cursor: auto
  background-color: rgba(0, 0, 0, 0.1)
  animation: fadeIn .2s ease
@keyframes fadeIn
  0%
    opacity: 0
  100%
</style>

