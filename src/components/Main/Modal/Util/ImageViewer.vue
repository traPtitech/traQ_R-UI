<template lang="pug">
.image-viewer-wrapper(
  @wheel.prevent="handleZoom"
  @mousemove="handlePan"
  @touchmove="handlePan"
  @mousedown="handleTouchStart"
  @touchstart="handleTouchStart"
  @mouseup="handleTouchEnd"
  @touchend="handleTouchEnd"
)
  .image-viewer-image(
    :class="imageClass"
    :style="imageStyle"
  )

</template>

<script>
const throttleInterval = 10
export default {
  name: 'ImageViewer',
  data() {
    return {
      lastPanTime: Date.now() - throttleInterval,
      lastTouchPosX: 0,
      lastTouchPosY: 0,
      scale: 1,
      viewerWidth: 0,
      viewerHeight: 0,
      translateX: 0,
      translateY: 0,
      pivotX: 0,
      pivotY: 0,
      viewerPivotX: 0,
      viewerPivotY: 0,
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
    updatePivot(layerX, layerY) {
      const newPivotX =
        (-this.translateX + layerX - this.pivotX) / this.scale + this.pivotX
      const newPivotY =
        (-this.translateY + layerY - this.pivotY) / this.scale + this.pivotY
      this.translateX = layerX - newPivotX
      this.translateY = layerY - newPivotY
      this.pivotX = newPivotX
      this.pivotY = newPivotY
    },
    handleZoom(event) {
      if (this.scale <= 1 && event.deltaY > 0) {
        this.scale = 1
        this.$nextTick(() => {
          this.translateX = 0
          this.translateY = 0
          this.pivotX = 0
          this.pivotY = 0
        })
        return
      }

      // for macOS' trackpad
      const scaleFactor = event.ctrlKey ? 30 : 100
      // Magic number festival!
      this.scale = Math.max(
        Math.min(this.scale * (1 - event.deltaY / scaleFactor), 20),
        1
      )

      if (
        this.viewerPivotX !== event.layerX ||
        this.viewerPivotY !== event.layerY
      ) {
        this.viewerPivotX = event.layerX
        this.viewerPivotY = event.layerY
        this.updatePivot(event.layerX, event.layerY)
      }
    },
    handlePan(event) {
      const now = Date.now()
      if (!this.isPanning || now - this.lastPanTime < throttleInterval) {
        return
      }
      this.lastPanTime = now
      this.translateX += event.layerX - this.lastTouchPosX
      this.translateY += event.layerY - this.lastTouchPosY
      this.lastTouchPosX = event.layerX
      this.lastTouchPosY = event.layerY
    },
    handleTouchStart(event) {
      this.isPanning = true
      this.lastTouchPosX = event.layerX
      this.lastTouchPosY = event.layerY
    },
    handleTouchEnd() {
      this.isPanning = false
      this.lastTouchPosX = 0
      this.lastTouchPosY = 0
      if (this.scale <= 1) {
        this.$nextTick(() => {
          this.translateX = 0
          this.translateY = 0
          this.pivotX = 0
          this.pivotY = 0
        })
      }
    }
  },
  computed: {
    imageStyle() {
      return {
        backgroundImage: `url(${this.url})`,
        transform: `
          scale(${this.scale})
          translate(${this.translate})
        `,
        transformOrigin: this.transformOrigin
      }
    },
    translate() {
      return `${this.translateX}px,
              ${this.translateY}px`
    },
    transformOrigin() {
      return `${this.pivotX + this.translateX}px
              ${this.pivotY + this.translateY}px`
    },
    imageClass() {
      return {
        'image-viewer-scale-deault': this.scale <= 1 && !this.isPanning
      }
    }
  },
  mounted() {
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

.image-viewer-scale-deault
  transition: transform 0.2s ease
</style>
