<template lang="pug">
.setting-input-container
  p {{ label }}
  input.setting-input.input-reset(:type="type" :value="value" @input="$emit('input', $event.target.value)")
</template>

<script>
export default {
  name: 'settingInput',
  data() {
    return {
      settingText: ''
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  methods: {
    reset() {
      this.settingText = ''
      this.$emit('inputsetting', '')
    }
  }
}
</script>

<style lang="sass">
.setting-input-container
  position: relative
  width: 100%

input.setting-input
  max-width: 100%
  padding:
    top: 4px
    right: 20px
    left: 10px
    bottom: 4px
  margin:
    top: 1rem
    bottom: 1.5rem
  border-radius: 4px
  background-color: $setting-background-color
  color: $text-color
  box-sizing: border-box
  &::placeholder
    color: $text-light-color
    opacity: 0.8
</style>
