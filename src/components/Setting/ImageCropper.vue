<template lang="pug">
.image-cropper(:class="{'rounded': rounded}")
  img.image-cropper-raw-image(:src="imageData")
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
  name: 'ImageCropper',
  data () {
    return {
      cropper: null,
      value: null
    }
  },
  props: {
    imageData: {
      type: String,
      required: true
    },
    rounded: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: null
    }
  },
  watch: {
    imageData () {
      if (this.cropper) {
        this.cropper.replace(this.imageData)
      }
    }
  },
  mounted () {
    const image = this.$el.querySelector('.image-cropper-raw-image')
    this.cropper = new Cropper(image, Object.assign({
      // スタンプ編集用の設定
      viewMode: 3,
      aspectRatio: 1,
      autoCropArea: 1,
      dragMode: 'move',
      cropend: () => {
        this.cropper.getCroppedCanvas().toBlob(blob => {
          this.$emit('input', blob)
        })
      }
    }, this.options))
  }
}
</script>

<style lang="sass">
.image-cropper
  width: 400px
  height: 400px
  +mq(sp)
    width: 80vw
    height: 80vw
.image-cropper.rounded
  .cropper-view-box, .cropper-face
    border-radius: 50%;

</style>
