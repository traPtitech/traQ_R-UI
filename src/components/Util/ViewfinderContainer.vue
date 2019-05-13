<template lang="pug">
.viewfinder-container(
  @wheel.prevent="handleWheel"
  @touchstart.prevent="handleTouchStart"
  @touchmove.prevent="handleTouchMove"
  @touchend.prevent="handleTouchEnd"
  @pointerup.prevent="handlePointerUp"
  @pointerleave.prevent="handlePointerUp"
  @pointermove.prevent="handlePointerMove"
  @pointerdown.prevent="handlePointerDown"
  @mousedown="handleMouseDown"
  @mousemove="handleMouseMove"
  @mouseup="handleMouseUp"
  @mouseleave="handleMouseUp"
)
  .viewfinder-content(
    ref="content"
    :style="contentStyle"
    :class="contentClass"
  )
    slot
</template>

<script>
const wheelTimeoutDuration = 100
const flickThresould = 10

export default {
  name: 'ViewfinderContainer',
  props: {
    /**
     * Pan by sigle finger on touch devices.
     */
    panBySingleFinger: {
      type: Boolean,
      default: true
    },

    minScale: {
      type: Number,
      default: 1
    },

    maxScale: {
      type: Number,
      default: 10
    },

    enableFlickY: {
      type: Boolean,
      default: true
    },

    flickDuration: {
      type: Number,
      default: 300
    },

    /**
     * @property { 'x' | 'y' | 'none' } closeMode
     */
    closeMode: {
      type: String,
      default: 'none',
      validator (value) {
        return ['x', 'y', 'none'].indexOf(value) !== -1
      }
    },
  },
  data() {
    return {
      containerRect: null,

      contentWidth: 0,
      contentHeight: 0,
      contentX: 0,
      contentY: 0,
      contentScale: 1,

      isDragging: false,
      isPanning: false,

      lastPanX: 0,
      lastPanY: 0,
      lastTouchDist: 0,

      isFlicking: false,
      potentiallyFlicking: false,
      potentiallyFlickingDirection: 0,

      toResetContentPos: false,

      wheelPosResetTimeoutId: null
    }
  },
  computed: {
    containerAspectRetio() {
      return this.containerRect ? this.containerWidth / this.containerHeight : 0
    },
    contentAspectRetio() {
      return this.contentWidth === 0
        ? 0
        : this.contentWidth / this.contentHeight
    },

    containerHeight() {
      return this.containerRect.height
    },
    containerWidth() {
      return this.containerRect.width
    },

    contentInitialLeft() {
      return this.contentAspectRetio > this.containerAspectRetio
        ? 0
        : (this.containerWidth - this.contentWidth) / 2
    },
    contentInitialTop() {
      return this.contentAspectRetio > this.containerAspectRetio
        ? (this.containerHeight - this.contentHeight) / 2
        : 0
    },

    contentBottom() {
      return this.contentY + this.contentHeight * this.contentScale
    },
    contentRight() {
      return this.contentX + this.contentWidth * this.contentScale
    },

    topBoundary() {
      return 0
    },
    leftBoundary() {
      return 0
    },
    bottomBoundary() {
      return this.contentHeight
    },
    rightBoundary() {
      return this.contentWidth
    },

    isExceedingTopBoundary() {
      return this.contentY > this.topBoundary
    },
    isExceedingLeftBoundary() {
      return this.contentX > this.leftBoundary
    },
    isExceedingBottomBoundary() {
      return this.contentBottom < this.bottomBoundary
    },
    isExceedingRightBoundary() {
      return this.contentRight < this.rightBoundary
    },

    flickEndX() {
      return this.contentInitialLeft + this.contentWidth
    },
    flickEndY() {
      return this.contentInitialTop + this.contentHeight
    },

    contentStyle() {
      return this.contentAspectRetio === 0
        ? {
            transform: `translate(${this.contentX}px, ${
              this.contentY
            }px) scale(${this.contentScale})`
          }
        : {
            top: `${this.contentInitialTop}px`,
            left: `${this.contentInitialLeft}px`,
            transform: `translate(${this.contentX}px, ${
              this.contentY
            }px) scale(${this.contentScale})`,
            transition: this.isFlicking
              ? `transform ${this.flickDuration / 1000}s ease-out`
              : ''
          }
    },
    contentClass() {
      return {
        'to-reset': this.toResetContentPos
      }
    }
  },
  methods: {
    /**
     * Updates container client rect.
     * Emits `resize` event with payload of type `ViewfinderResizePayload`.
     */
    updateRect() {
      this.containerRect = this.$el.getBoundingClientRect()
      this.$emit('resize', {
        width: this.containerWidth,
        height: this.containerHeight
      })
    },

    updateContentSize() {
      const rect = this.$refs.content.getBoundingClientRect()
      if (rect.width === 0) {
        requestAnimationFrame(() => this.updateContentSize())
        return
      }
      this.contentWidth = rect.width
      this.contentHeight = rect.height
    },

    adjustContentPos() {
      let flag = false
      this.toResetContentPos = true
      if (this.isExceedingTopBoundary) {
        this.contentY = this.topBoundary
        flag = true
      }
      if (this.isExceedingLeftBoundary) {
        this.contentX = this.leftBoundary
        flag = true
      }
      if (this.isExceedingBottomBoundary) {
        this.contentY =
          this.bottomBoundary - this.contentHeight * this.contentScale
        flag = true
      }
      if (this.isExceedingRightBoundary) {
        this.contentX =
          this.rightBoundary - this.contentWidth * this.contentScale
        flag = true
      }
      if (flag && this.contentScale === 1) {
        this.$emit('position-reset')
      }
    },

    startFlick() {
      if (!this.potentiallyFlicking) return

      this.isFlicking = true
      if (this.potentiallyFlickingDirection > 0) {
        this.contentY = this.flickEndY
      } else {
        this.contentY = -this.flickEndY
      }

      this.$emit('flick-start')
      setTimeout(() => this.$emit('flick-end'), this.flickDuration)
    },

    processFlick(from, to) {
      const now = (new Date()).valueOf()
      if (now < to) {

      }
    },

    /**
     * @argument {[number, number]} position coordinate in content
     * @argument {number} scale new scale
     */
    zoom(position, scale) {
      this.toResetContentPos = false
      if (scale < this.minScale) {
        this.contentScale = this.minScale
        return
      }
      if (scale > this.maxScale) {
        this.contentScale = this.maxScale
        return
      }
      const oldX = this.contentX
      const oldY = this.contentY
      const oldScale = this.contentScale
      this.contentScale = scale
      this.contentX = (1 - scale / oldScale) * (position[0] - oldX) + oldX
      this.contentY = (1 - scale / oldScale) * (position[1] - oldY) + oldY
    },

    pan(deltaX, deltaY, checkFlick) {
      this.toResetContentPos = false

      // change content position depending on close mode
      if (this.closeMode === 'x' && this.contentScale === this.minScale) {
        this.contentX += deltaX
        this.$emit('close-process', Math.min(1, Math.max(0, Math.abs(this.contentX / this.flickEndX))))
      }
      else if (this.closeMode === 'y' && this.contentScale === this.minScale) {
        this.contentY += deltaY
        this.$emit('close-process', Math.min(1, Math.max(0, Math.abs(this.contentY / this.flickEndY))))
      }
      else {
        this.contentX += deltaX
        this.contentY += deltaY
      }

      if (!checkFlick || this.contentScale !== this.minScale) return

      if (this.enableFlickY && Math.abs(deltaY) > flickThresould) {
        this.potentiallyFlicking = true
        this.potentiallyFlickingDirection = Math.sign(deltaY)
      } else {
        this.potentiallyFlicking = false
        this.potentiallyFlickingDirection = 0
      }
    },

    toContainerLayerPos(clientX, clientY) {
      return [
        clientX - this.contentInitialLeft - this.containerRect.left,
        clientY - this.contentInitialTop - this.containerRect.top
      ]
    },

    getMidPointOfTouches(touches) {
      const [touch1, touch2] = touches
      return [
        (touch1.clientX + touch2.clientX) / 2,
        (touch1.clientY + touch2.clientY) / 2
      ]
    },
    getDistOfTouches(touches) {
      const [touch1, touch2] = touches
      return Math.sqrt(
        (touch1.clientX - touch2.clientX) ** 2 +
          (touch1.clientY - touch2.clientY) ** 2
      )
    },

    handleWheel(event) {
      if (this.isDragging) {
        return
      }
      if (event.ctrlKey) {
        this.zoom(
          this.toContainerLayerPos(event.clientX, event.clientY),
          this.contentScale - event.deltaY / 100
        )
        this.$emit('zoom', this.contentScale - event.deltaY / 100)
      } else {
        this.pan(-event.deltaX, -event.deltaY)
      }
      if (this.wheelPosResetTimeoutId !== null) {
        clearTimeout(this.wheelPosResetTimeoutId)
      }
      this.wheelPosResetTimeoutId = setTimeout(() => {
        this.adjustContentPos()
      }, wheelTimeoutDuration)
    },

    handleTouchStart(event) {
      if (event.touches.length === 1 && this.panBySingleFinger) {
        this.isPanning = true
        const touch = event.touches[0]
        this.lastPanX = touch.clientX
        this.lastPanY = touch.clientY
      }
      if (event.touches.length === 2) {
        this.isPanning = true
        const [x, y] = this.getMidPointOfTouches(event.touches)
        const dist = this.getDistOfTouches(event.touches)
        this.lastPanX = x
        this.lastPanY = y
        this.lastTouchDist = dist
      }
    },
    handleTouchMove(event) {
      if (
        event.touches.length === 1 &&
        this.panBySingleFinger &&
        this.isPanning
      ) {
        const touch = event.touches[0]
        this.pan(
          touch.clientX - this.lastPanX,
          touch.clientY - this.lastPanY,
          true
        )
        this.lastPanX = touch.clientX
        this.lastPanY = touch.clientY
      }

      if (event.touches.length === 2 && this.isPanning) {
        const [x, y] = this.getMidPointOfTouches(event.touches)
        const dist = this.getDistOfTouches(event.touches)
        this.pan(x - this.lastPanX, y - this.lastPanY)
        this.zoom([x, y], (this.contentScale * dist) / this.lastTouchDist)
        this.lastPanX = x
        this.lastPanY = y
        this.lastTouchDist = dist
      }
    },
    handleTouchEnd(event) {
      if (event.changedTouches.length === 1 && this.panBySingleFinger) {
        this.isPanning = false
        if (this.potentiallyFlicking) {
          this.startFlick()
        } else {
          this.adjustContentPos()
        }
      }
      if (event.changedTouches.length === 2) {
        this.isPanning = false
        this.adjustContentPos()
      }
    },

    handlePointerDown(event) {
      this.isPanning = true
      this.lastPanX = event.clientX
      this.lastPanY = event.clientY
    },
    handlePointerMove(event) {
      if (this.isPanning) {
        this.pan(event.clientX - this.lastPanX, event.clientY - this.lastPanY)
        this.lastPanX = event.clientX
        this.lastPanY = event.clientY
      }
    },
    handlePointerUp() {
      this.isPanning = false
      this.adjustContentPos()
    },

    handleMouseDown(event) {
      this.isPanning = true
      this.lastPanX = event.clientX
      this.lastPanY = event.clientY
    },
    handleMouseMove(event) {
      if (this.isPanning) {
        this.pan(event.clientX - this.lastPanX, event.clientY - this.lastPanY)
        this.lastPanX = event.clientX
        this.lastPanY = event.clientY
      }
    },
    handleMouseUp() {
      this.isPanning = false
      this.adjustContentPos()
    }
  },
  mounted() {
    this.updateRect()
    this.updateContentSize()
    window.addEventListener('resize', () => this.updateRect())
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => this.updateRect())
  }
}
</script>

<style lang="sass">
.viewfinder-container
  width: 100%
  height: 100%
  position: relative
  overflow: hidden
.viewfinder-content
  position: relative
  width: max-content
  height: max-content
  transform-origin: top left
  will-change: transform
  &.to-reset
    transition: transform 0.3s ease
</style>
