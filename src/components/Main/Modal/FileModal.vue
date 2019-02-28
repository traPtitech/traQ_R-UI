<template lang="pug">
base-common-modal(:title="`FILE: ${data.name}`" small)
  icon-file(color="var(--primary-color-on-bg)" slot="header-icon" :size="24")
  .file-modal-wrapper
    img.file-modal-image(
      :src="fileUrl(data.fileId)" 
    )

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
    ...mapGetters(['fileUrl'])
  }
}
</script>

<style lang="sass">
</style>
