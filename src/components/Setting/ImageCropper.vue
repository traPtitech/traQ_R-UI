<template lang="pug">
.image-cropper-wrap
  .image-cropper(:class="{'rounded': rounded}")
    img.image-cropper-raw-image(:src="imageData")
  p.image-cropper-note {{ cropperNote }}
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
  name: 'ImageCropper',
  data () {
    return {
      cropper: null,
      value: null,
      cropperNote: '画像の位置・サイズを編集できます'
    }
  },
  props: {
    imageData: {
      // base64エンコードされた画像データ
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
  computed: {
    mime () {
      const start = this.imageData.indexOf(':') + 1
      const end = this.imageData.indexOf(';') - start
      return this.imageData.substr(start, end)
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
    if (this.mime === 'image/gif') {
      this.cropperNote = 'GIFは切り抜きできません'
      this.cropper = new Cropper(image, Object.assign({
        // スタンプ編集用の設定
        viewMode: 3,
        aspectRatio: 1,
        autoCropArea: 1,
        dragMode: 'none',
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false
      }, this.options))
    } else {
      this.cropper = new Cropper(image, Object.assign({
        // スタンプ編集用の設定
        viewMode: 3,
        aspectRatio: 1,
        autoCropArea: 1,
        dragMode: 'move',
        cropend: () => {
          this.cropper.getCroppedCanvas().toBlob(blob => {
            this.$emit('input', blob)
          }, this.mime)
        }
      }, this.options))
    }
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

.image-cropper-note
  margin: 1rem 0
  opacity: 0.8
  font-size: 0.8rem
</style>
