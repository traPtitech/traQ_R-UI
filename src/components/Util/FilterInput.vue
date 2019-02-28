<template lang="pug">
.filter-input-container
  DebouncedInput.input-reset.filter-input(
    v-if="useDebounce"
    placeholder="検索" 
    v-model="filterText" 
    @input="$emit('inputFilter', filterText)")
  input.input-reset.filter-input(
    v-else
    placeholder="検索" 
    v-model="filterText" 
    @input="$emit('inputFilter', filterText)")
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
  props: {
    useDebounce: {
      type: Boolean,
      defualt: false
    }
  },
  data () {
    return {
      filterText: ''
    }
  },
  methods: {
    reset () {
      this.filterText = ''
      this.$emit('inputFilter', '')
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

