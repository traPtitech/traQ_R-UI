<template lang="pug">
div.stamp-picker-overlay(@on="active=true" v-if="active")
  div.stamp-picker
</template>

<script>
export default {
  name: 'StampPicker',
  props: {
    active: false
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="sass">
.stamp-picker-overlay
  position: absolute
  top: 0
  width: 100%
  height: 100%
  background-color: rgba(0,0,0,0.3)
.stamp-picker
</style>

