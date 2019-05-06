<template lang="pug">
base-common-modal(title="QR Code" small)
  IconQRCode(color="var(--primary-color-on-bg)" slot="header-icon" size="24")
  .qr-code-modal
    .qr-code-modal-image(:style="qrImageStyle")
</template>

<script>
import { mapState } from 'vuex'
import client from '@/bin/client'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import IconQRCode from '@/components/Icon/IconQRCode'

export default {
  name: 'CodeModal',
  components: {
    BaseCommonModal,
    IconQRCode
  },
  computed: {
    ...mapState('modal', ['data']),
    qrImageStyle() {
      return {
        backgroundImage: `url(${this.qrCodeUrl})`
      }
    },
    qrCodeUrl() {
      return client.getQRCodeUrl()
    }
  }
}
</script>

<style lang="sass">
.qr-code-modal
  height: 50vh

.qr-code-modal-image
  height: 100%
  background:
    size: contain
    position: center
    repeat: no-repeat
</style>
