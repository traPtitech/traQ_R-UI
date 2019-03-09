<template lang="pug">
.setting-button(@click="$emit('click')")
  slot
</template>

<script>
export default {
  name: 'settingButton',
  data() {
    return {
      settingText: ''
    }
  }
}
</script>

<style lang="sass">
.setting-button
  display: inline-block
  padding: .5rem 1rem
  color: $primary-color-on-bg
  border: 1px solid $primary-color-on-bg
  border-radius: 4px
  cursor: pointer
</style>
