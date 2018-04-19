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
  position: fixed;
  z-index: 101;
  width: 80%;
  top: 5vh;
  background-color: #f5f5f5;
  color: #000;
  box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.25)

.modal-overlay
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 120%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.75)
</style>

