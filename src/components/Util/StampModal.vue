<template lang="pug">
div.stamp-modal-overlay(v-if="active" @click="$emit('close')")
  div.stamp-modal(@click.stop="")
    slot
</template>

<script>
export default {
  name: 'StampModal',
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
.stamp-modal
  border-radius: 10px
  width: 360px
  height: 60vh
  position: fixed
  background-color: $background-color
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.4)
  right: 10px
  bottom: $input-height

  +mq(sp)
    width: 96vw
    left: 2vw
    right: 2vw
    bottom: $input-height

.stamp-modal-overlay
  z-index: $stamp-modal-index
  position: fixed
  width: 100%
  height: 100%
  top: 0
  left: 0
  cursor: auto
</style>

