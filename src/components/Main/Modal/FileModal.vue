<template lang="pug">
.file-modal
  .file-modal-header-wrap(
    @click="close"
    @wheel.stop.prevent
  )
    .file-modal-close(@click="close")
      icon-close(color="white" size="16")
  image-viewer.file-modal-image-viewer(
    :url="imageSrc"
    :flick-duration="flickDuration"
    @close-start="handleCloseStart"
    @close="close"
  )
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import ImageViewer from '@/components/Main/Modal/Util/ImageViewer'
import IconClose from '@/components/Icon/IconClose'

export default {
  name: 'FileModal',
  components: {
    IconClose,
    ImageViewer
  },
  data() {
    return {
      flickDuration: 200
    }
  },
  methods: {
    ...mapActions({
      close: 'modal/close'
    }),
    handleCloseStart() {
      this.$emit('fadeout-start', this.flickDuration)
    }
  },
  computed: {
    ...mapState('modal', ['data']),
    ...mapGetters(['fileUrl']),
    imageSrc() {
      return this.fileUrl(this.data.fileId)
    }
  },
  mounted() {
    this.$emit('opacity-change', 0.7)
  },
  beforeDestroy() {
    this.$emit('opacity-change', -1)
  }
}
</script>

<style lang="sass">
// override
.file-modal.modal
  background: #222222
  width: 100vw
  height: 100%
  max-height: 100%
  max-width: 60rem
  overflow: hidden
  border-radius: 0
.file-modal-header-wrap
  position: absolute
  display: flex
  justify-content: flex-end
  align-items: center
  +mq(pc)
    padding: 0 2rem
  +mq(sp)
    padding: 0 1rem
  height: 3rem
  width: 100%
  background: linear-gradient(0deg, transparent, #222222)
  z-index: 1
.file-modal-close
  display: flex
  justify-content: center
  align-items: center
  height: 2rem
  width: 2rem
  cursor: pointer
</style>
