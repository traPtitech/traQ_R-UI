<template lang="pug">
.filter-input-container(:data-is-on-bg="isOnBg ? 'true' : 'false'")
  debounced-input.input-reset.filter-input(
    v-if="useDebounce"
    :placeholder="placeholder"
    :value="filterText"
    @keydown="keydownDebounce"
    @input="handleInput")
  input.input-reset.filter-input(
    v-else
    :placeholder="placeholder"
    :value="filterText"
    @keydown="keydown"
    @input="handleInput")
  .filter-input-reset(v-if="filterText !== ''" @click="reset")
    icon-close(:color="isOnBg ? 'var(--primary-color-on-bg)' : 'white'")
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
    isOnBg: {
      type: Boolean,
      default: false
    },
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
    keydownDebounce(key) {
      if (key === 'Escape') {
        this.reset()
      }
    },
    keydown(event) {
      if (event.key === 'Escape') {
        this.reset()
      }
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
  transition: box-shadow .5s ease

input.filter-input
  max-width: 100%
  height: 32px
  padding:
    top: 4px
    right: 20px
    left: 10px
    bottom: 4px
  border-radius: 4px
  background:
    color: var(--white-on-primary)
  color: $text-light-color
  box-sizing: border-box
  transition: background .2s ease

  &:hover
    background:
      color: var(--white-on-primary-hovered)

  &::placeholder
    color: $text-light-color
    opacity: 0.8

.filter-input-container[data-is-on-bg="true"] input.filter-input
  background:
    color: var(--setting-background-color)
  color: $text-color

  &:hover
    background:
      color: var(--setting-background-hover-color)

  &::placeholder
    color: $text-color

.filter-input-reset
  cursor: pointer
  position: absolute
  width: 12px
  height: 16px
  right: 10px
  top: 50%
  transform: translateY(-50%)
</style>
