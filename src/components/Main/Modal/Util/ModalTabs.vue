<template lang="pug">
.modal-tabs
  .modal-tabs-pane-wrap
    .modal-tabs-pane.flex-center(v-for="option in options"
                                 :key="option"
                                 :class="{'pane-active': option === value}"
                                 @click="handleClick(option)")
      slot(:name="option")
  .modal-tabs-indicator(:style="indicatorStyle")
</template>

<script>
export default {
  name: 'ModalTabs',
  data() {
    return {
      value: this.options[0]
    }
  },
  props: {
    options: Array
  },
  methods: {
    handleClick(option) {
      this.value = option
      this.$emit('input', option)
    }
  },
  computed: {
    activeIndex() {
      return this.options.indexOf(this.value)
    },
    indicatorStyle() {
      return {
        width: `${100 / this.options.length}%`,
        left: `${(100 / this.options.length) * this.activeIndex}%`
      }
    }
  }
}
</script>

<style lang="sass">
.modal-tabs
  width: 100%
  +mq(pc)
    height: 4rem
  +mq(sp)
    height: 3rem
  position: relative
  border-bottom: 1px solid $primary-color-on-bg
.modal-tabs-pane-wrap
  height: 100%
  display: flex
  justify-content: space-between
.modal-tabs-pane
  width: 100%
  height: 100%
  cursor: pointer
  &:not(.pane-active)
    opacity: 0.5
  &:hover
    opacity: 1
.modal-tabs-indicator
  position: absolute
  bottom: 0
  height: 3px
  background: $primary-color-on-bg
  will-change: left
  transition:
    property: all
    duration: 0.1s
    timing-function: ease
</style>
