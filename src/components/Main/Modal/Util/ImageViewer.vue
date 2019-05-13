<template lang="pug">
viewfinder-container.image-viewer(
  close-mode="y"
  :flick-duration="flickDuration"
  @resize="handleViewfinderResize"
  @flick-end="$emit('close')"
  @close-process="handleCloseProcess"
  @position-reset="$emit('position-reset')"
)
  img.image-viewer-image(
    ref="image"
    :src="url"
    :style="imageStyle"
    @dragstart.prevent.stop
  )

</template>

<script>
import ViewfinderContainer from '@/components/Util/ViewfinderContainer'
export default {
  name: 'ImageViewer',
  components: {
    ViewfinderContainer
  },
  data() {
    return {
      imageDecoded: false,
      imageAspectRatio: 0,
      imageWidth: 0,
      imageHeight: 0,
      containerHeight: 0,
      containerWidth: 0
    }
  },
  props: {
    url: {
      type: String,
      required: true
    },
    flickDuration: {
      type: Number,
      default: 300
    }
  },
  methods: {
    handleViewfinderResize(payload) {
      this.containerHeight = payload.height
      this.containerWidth = payload.width
      this.resizeImage()
    },
    resizeImage() {
      const containerAspectRatio = this.containerWidth / this.containerHeight
      if (this.imageAspectRatio > containerAspectRatio) {
        this.imageWidth = this.containerWidth
        this.imageHeight = this.containerWidth / this.imageAspectRatio
      } else {
        this.imageWidth = this.containerHeight * this.imageAspectRatio
        this.imageHeight = this.containerHeight
      }
    },
    handleCloseProcess(process) {
      this.$emit('close-process', process)
    }
  },
  computed: {
    imageStyle() {
      return this.imageDecoded
        ? {
            height: `${this.imageHeight}px`,
            width: `${this.imageWidth}px`
          }
        : {
            display: 'none'
          }
    }
  },
  mounted() {
    this.$refs.image.onload = () => {
      this.imageAspectRatio =
        this.$refs.image.naturalWidth / this.$refs.image.naturalHeight
      this.resizeImage()
      this.imageDecoded = true
    }
  }
}
</script>

<style lang="sass">
.image-viewer-image
  width: 100%
  height: 100%
  background:
    size: contain
    repeat: no-repeat
    position: center
</style>
