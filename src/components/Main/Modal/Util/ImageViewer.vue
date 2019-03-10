<template lang="pug">
.image-viewer-wrapper(
  @wheel.prevent="handleWheel"
  @mousemove="handleTouchMove"
  @touchmove="handleTouchMove"
  @mousedown="handleTouchStart"
  @touchstart="handleTouchStart"
  @mouseup="handleTouchEnd"
  @touchend="handleTouchEnd"
)
  .image-viewer-image(:style="imageStyle")

</template>

<script>
const throttleInterval = 20
export default {
  name: 'ImageViewer',
  data () {
    return {
      lastPanTime: Date.now() - throttleInterval,
      lastTouchPosX: 0,
      lastTouchPosY: 0,
      scale: 1,
      viewerWidth: 0,
      viewerHeight: 0,
      viewerX: 0,
      viewerY: 0,
      isPanning: false
    }
  },
  props: {
    url: {
      type: String,
      required: true
    }
  },
  methods: {
    handleWheel (event) {
      const scaleFactor = event.ctrlKey ? 30 : 100
      const oldScale = this.scale
      const newScale = Math.max(this.scale - event.deltaY / scaleFactor, 1)
      this.viewerX += event.layerX * (1 / oldScale - 1 / newScale)
      this.viewerY += event.layerY * (1 / oldScale - 1 / newScale)
      this.scale = newScale
    },
    handleTouchMove (event) {
      const now = Date.now()
      if (!this.isPanning || now - this.lastPanTime < throttleInterval) {
        return
      }
      this.lastPanTime = now
      this.viewerX += -(event.layerX - this.lastTouchPosX)
      this.viewerY += -(event.layerY - this.lastTouchPosY)
    },
    handleTouchStart (event) {
      this.isPanning = true
      this.lastTouchPosX = event.layerX
      this.lastTouchPosY = event.layerY
    },
    handleTouchEnd () {
      this.isPanning = false
      this.lastTouchPosX = 0
      this.lastTouchPosY = 0
    }
  },
  computed: {
    imageStyle () {
      return {
        backgroundImage: `url(${this.url})`,
        transform: `
          scale(${this.scale})
          translate(${this.translate})
        `,
//         transformOrigin: this.transformOrigin
      }
    },
    translate () {
      return `${-this.viewerX}px,
              ${-this.viewerY}px`
    },
    transformOrigin () {
      return `${this.pivotX}px ${this.pivotY}px`
    }
  },
  mounted () {
    const clientRect = this.$el.getBoundingClientRect()
    this.viewerWidth = clientRect.width
    this.viewerHeight = clientRect.height
  }
}
</script>

<style lang="sass">
.image-viewer-wrapper
  height: 100%
  width: 100%
  display: flex
  justify-content: center
  align-items: center
  overflow: hidden

.image-viewer-image
  width: 100%
  height: 100%
  background:
    size: contain
    repeat: no-repeat
    position: center
</style>
