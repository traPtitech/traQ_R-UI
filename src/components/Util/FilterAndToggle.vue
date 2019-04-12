<template lang="pug">
.filter-wrapper
  .filter-input-wrapper
    filter-input(
      :filterText="filterText"
      @input="handleInput"
      :useDebounce="true"
      :class="dropShadow")
  .toggle-button-wrapper
    toggle-button(
      :isActive="isUnreadFiltered"
      @change="handleToggle"
      :class="dropShadow")
      img(src="@/assets/img/icon/unread.svg")
</template>

<script>
import FilterInput from '@/components/Util/FilterInput'
import ToggleButton from '@/components/Util/ToggleButton'

export default {
  name: 'FilterAndToggle',
  components: {
    FilterInput,
    ToggleButton
  },
  props: {
    hasDropShadow: {
      type: Boolean,
      default: false
    },
    filterText: {
      type: String,
      default: ''
    },
    isUnreadFiltered: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dropShadow() {
      return {
        'drop-shadow': this.hasDropShadow
      }
    }
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event)
    },
    handleToggle(event) {
      this.$emit('change', event)
    }
  }
}
</script>

<style lang="sass">
.filter-wrapper
  width: 100%
  display: flex

.filter-input-wrapper
  width: calc(100% - 38px)

.toggle-button-wrapper
  margin:
    left: 6px

  img
    width: 55%
    margin:
      left: 4px
      bottom: 2px
</style>
