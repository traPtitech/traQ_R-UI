<template lang="pug">
.filter-input-container
  debounced-input.input-reset.filter-input(
    v-if="useDebounce"
    :placeholder="placeholder"
    :value="filterText"
    @input="handleInput")
  input.input-reset.filter-input(
    v-else
    :placeholder="placeholder"
    :value="filterText"
    @input="handleInput")
  .filter-input-reset(v-if="filterText !== ''" @click="reset")
    icon-close(color="white")
</template>

<script>
import DebouncedInput from '@/components/Util/DebouncedInput'
import IconClose from '@/components/Icon/IconClose'

export default {
  name: 'FilterInput',
  components: {
    DebouncedInput,
    IconClose
  },
  model: {
    prop: 'filterText',
    event: 'input'
  },
  props: {
    useDebounce: {
      type: Boolean,
      default: false
    },
    filterText: {
      type: String,
      requried: true
    },
    placeholder: {
      type: String,
      default: '検索'
    }
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event)
    },
    reset() {
      this.$emit('input', '')
    }
  }
}
</script>

<style lang="sass">
.filter-input-container
  position: relative
  width: 100%

input.filter-input
  max-width: 100%
  padding:
    top: 4px
    right: 20px
    left: 10px
    bottom: 4px
  border-radius: 4px
  background: rgba(255,255,255,0.2)
  color: $text-light-color
  box-sizing: border-box
  transition: background .2s ease

  &:hover
    background: rgba(255,255,255,0.3)

  &::placeholder
    color: $text-light-color
    opacity: 0.8

.filter-input-reset
  cursor: pointer
  position: absolute
  width: 12px
  height: 16px
  right: 10px
  top: 50%
  transform: translateY(-50%)
</style>
