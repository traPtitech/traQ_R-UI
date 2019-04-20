<template lang="pug">
.setting-input-container
  p {{ label }}
  .setting-input-box(@click="focusInput")
    span.setting-input-prefix {{ prefix }}
    input.setting-input.input-reset(
      :type="text"
      :value="value"
      ref="input"
      @input="$emit('input', $event.target.value)")
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
    prefix: {
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
    },
    focusInput() {
      this.$refs.input.focus()
    }
  }
}
</script>

<style lang="sass">
.setting-input-container
  position: relative
  width: 100%

.setting-input-box
  max-width: 100%
  border-radius: 4px
  margin:
    top: 1rem
    bottom: 1.5rem
  background-color: $setting-background-color

.setting-input-prefix
  padding:
    left: 10px
  font:
    weight: bold

input.setting-input
  padding:
    top: 4px
    right: 20px
    left: 10px
    bottom: 4px
  background-color: transparent
  color: $text-color
  box-sizing: border-box
  &::placeholder
    color: $text-light-color
    opacity: 0.8
</style>
