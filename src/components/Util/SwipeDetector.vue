<template lang="pug">
div(
  @touchstart.passive = "start"
  @touchmove.passive = "move"
  @touchend.passive = "end"
  @click.passive = "click"
  )
  slot
</template>

<script>
export default {
  name: 'SwipeDetector',
  data () {
    return {
      isTouchActive: false
    }
  },
  methods: {
    start (event) {
      this.isTouchActive = true
      this.$emit('swipeStart', event)
    },
    move (event) {
      this.$emit('swipeMoving', event)
    },
    end (event) {
      this.isTouchActive = false
      this.$emit('swipeEnd', event)
    },
    click (event) {
      // console.log(event)
    }
  }
}
</script>

<style lang="sass">

</style>
