<template lang="pug">
div.filter-input-container
  input.input-reset.filter-input(placeholder="検索" v-model="filterText" @input="$emit('inputFilter', filterText)")
  div.filter-input-reset(v-if="filterText !== ''" @click="reset")
    icon(name="times" scale="0.8")
</template>

<script>
export default {
  name: 'FilterInput',
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
    top: 2px
    right: 20px
    left: 10px
    bottom: 2px
  border-radius: 3px
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
  right: 3px
  top: 50%
  transform: translateY(-50%)

</style>

