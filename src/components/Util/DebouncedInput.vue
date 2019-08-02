<template lang="pug">
input(@input="handleInput" :value="value" :placeholder="placeholder" @keydown="keydown")
</template>

<script>
export default {
  name: 'DebouncedInput',
  data() {
    return {
      timerId: null
    }
  },
  props: {
    intervalMilliSec: {
      type: Number,
      default: 200
    },
    value: {
      type: String,
      requried: true
    },
    enableDebounceOnEmptyInput: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleInput(event) {
      if (!this.enableDebounceOnEmptyInput && event.target.value === '') {
        this.$emit('input', event.target.value)
        return
      }
      clearTimeout(this.timerId)
      this.timerId = setTimeout(() => {
        this.$emit('input', event.target.value)
      }, this.intervalMilliSec)
    },
    keydown(event) {
      this.$emit('keydown', event.key)
    }
  }
}
</script>

<style></style>
