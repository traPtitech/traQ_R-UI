<template lang="pug">
base-common-modal(:title="`FILE: ${data.name}`" small)
  icon-file(color="var(--primary-color-on-bg)" slot="header-icon" :size="24")
  .file-modal-wrapper
    .file-modal-image(:style="imageStyle")

</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import MemberElement from '@/components/Main/Sidebar/Content/MemberElement'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import IconFile from '@/components/Icon/IconFile'

export default {
  name: 'FileModal',
  components: {
    BaseCommonModal,
    MemberElement,
    IconFile
  },
  methods: {
    ...mapActions({
      closeModal: 'modal/close'
    })
  },
  computed: {
    ...mapState('modal', ['data']),
    ...mapGetters(['fileUrl']),
    imageStyle () {
      return {
        backgroundImage: `url(${this.fileUrl(this.data.fileId)})`
      }
    }
  }
}
</script>

<style lang="sass">
.file-modal-wrapper
  height: calc(80vh - 6rem)
  display: flex
  justify-content: center
  align-items: center

.file-modal-image
  width: 100%
  height: 100%
  background:
    size: contain
    repeat: no-repeat
    position: center

</style>
