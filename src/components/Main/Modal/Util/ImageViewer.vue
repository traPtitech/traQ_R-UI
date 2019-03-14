<template lang="pug">
.image-viewer-wrapper(
  @wheel.prevent="handleWheel"
  @mousemove.prevent="pan($event.layerX, $event.layerY)"
  @touchmove.prevent="handleTouchMove"
  @mousedown.prevent="handleMouseDown"
  @touchstart.prevent="handleTouchStart"
  @mouseup.prevent="handleMouseUp"
  @touchend.prevent="handleTouchEnd"
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
      lastTouchDistance: 0,
      scale: 1,
      viewerClientX: 0,
      viewerClientY: 0,
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
    touchClientPosMean(touches) {
      return Array.from(touches)
        .map(t => [t.clientX, t.clientY])
        .reduce((acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]])
        .map(p => p / touches.length)
    },
    touchDistance(touches) {
      return Math.sqrt(
        (touches[0].clientX - touches[1].clientX) ** 2 +
          (touches[0].clientY - touches[1].clientY) ** 2
      )
    },
    transformPoint(x, y) {
      const px = this.pivotX + this.translateX
      const py = this.pivotY + this.translateY
      const tx = (x + this.translateX - px) * this.scale + px
      const ty = (y + this.translateY - py) * this.scale + py
      return [tx, ty]
    },
    zoom(layerX, layerY, scale, isScrollDown) {
      requestAnimationFrame(() => {
        if (this.scale <= 1 && isScrollDown) {
          this.scale = 1
          this.$nextTick(() => {
            this.translateX = 0
            this.translateY = 0
            this.pivotX = 0
            this.pivotY = 0
            this.viewerPivotX = 0
            this.viewerPivotY = 0
          })
          return
        }

        // for macOS' trackpad
        // Magic number festival!
        this.scale = Math.max(Math.min(this.scale * scale, 20), 1)

        if (this.viewerPivotX !== layerX || this.viewerPivotY !== layerY) {
          this.viewerPivotX = layerX
          this.viewerPivotY = layerY
          this.updatePivot(layerX, layerY)
        }
      })
    },
    handleWheel(event) {
      const scaleFactor = event.ctrlKey ? 30 : 100
      this.zoom(
        event.layerX,
        event.layerY,
        1 - event.deltaY / scaleFactor,
        event.deltaY > 0
      )
    },
    pan(layerX, layerY) {
      requestAnimationFrame(() => {
        const now = Date.now()
        if (!this.isPanning || now - this.lastPanTime < throttleInterval) {
          return
        }
        this.lastPanTime = now
        this.translateX += layerX - this.lastTouchPosX
        this.translateY += layerY - this.lastTouchPosY
        this.lastTouchPosX = layerX || 0
        this.lastTouchPosY = layerY || 0
      })
    },
    handleTouchMove(event) {
      if (event.touches.length === 1) {
        this.pan(
          event.touches[0].clientX - this.viewerClientX,
          event.touches[0].clientY - this.viewerClientY
        )
      }
      if (event.touches.length === 2) {
        const [cx, cy] = this.touchClientPosMean(event.touches)
        const dist = this.touchDistance(event.touches)
        this.pan(cx - this.viewerClientX, cy - this.viewerClientY)
        this.zoom(
          cx - this.viewerClientX,
          cy - this.viewerClientY,
          dist / this.lastTouchDistance,
          dist < this.lastTouchDistance
        )
        this.lastTouchDistance = dist
      }
    },
    handleTouchStart(event) {
      this.isPanning = true
      const [x, y] = this.touchClientPosMean(event.touches)
      this.lastTouchPosX = x || 0
      this.lastTouchPosY = y || 0
      if (event.touches.length == 2) {
        this.lastTouchDistance = this.touchDistance(event.touches) || 0
      }
    },
    handleTouchEnd() {
      this.isPanning = false
      this.lastTouchPosX = 0
      this.lastTouchPosY = 0
      this.lastTouchDistance = 0
      if (this.scale <= 1) {
        this.$nextTick(() => {
          this.translateX = 0
          this.translateY = 0
          this.pivotX = 0
          this.pivotY = 0
        })
      }
    },
    handleMouseDown() {
      this.isPanning = true
      this.lastTouchPosX = event.layerX || 0
      this.lastTouchPosY = event.layerY || 0
    },
    handleMouseUp() {
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
    },
    handleWindowResize() {
      const clientRect = this.$el.getBoundingClientRect()
      this.viewerWidth = clientRect.width
      this.viewerHeight = clientRect.height
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
    this.handleWindowResize()
    window.addEventListener('resize', this.handleWindowResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
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
  will-change: transform
  background:
    size: contain
    repeat: no-repeat
    position: center

.image-viewer-scale-deault
  transition: transform 0.2s ease
</style>
