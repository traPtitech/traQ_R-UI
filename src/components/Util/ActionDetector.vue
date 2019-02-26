<template lang="pug">
.action-detector(
  @dragenter = "style=onDragStyle" 
  @dragend = "style=''" 
  @dragleave = "style=''" 
  @dragover.stop.prevent = "dragover" 
  @drop.stop.prevent = "dropFile" :style="style"
  @touchstart.passive = "start"
  @touchmove.passive = "move"
  @touchend.passive = "end"
  @click.passive = "click")
  slot
</template>

<script>
export default {
  name: 'ActionDetector',
  props: ['onDragStyle'],
  data () {
    return {
      style: '',
      isTouchActive: false
    }
  },
  methods: {
    dragover (event) {},
    dropFile (event) {
      if (process.env.NODE_ENV === 'development') {
        console.info('file drop event', event)
      }
      if (event.dataTransfer.files.length > 0) {
        this.$emit('dropFile', event.dataTransfer.files)
      }
    },
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
.action-detector
  position: absolute
  top: 0
  right: 0
  width: 100%
  height: 100%
</style>
