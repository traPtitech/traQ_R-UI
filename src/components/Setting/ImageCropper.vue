<template lang="pug">
.image-cropper
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
    this.cropper = new Cropper(image, this.options || {
      // スタンプ編集用の設定
      viewMode: 2,
      aspectRatio: 1,
      autoCropArea: 1,
      dragMode: 'move',
      cropend: () => {
        this.cropper.getCroppedCanvas().toBlob(blob => {
          this.$emit('input', blob)
        })
      }
    })
  }
}
</script>

<style lang="sass">
.image-cropper
  min-height: 30vw
</style>
