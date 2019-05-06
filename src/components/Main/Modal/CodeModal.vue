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
  methods: {
    checkQRCodeImage() {
      this.$store.commit('modal/setQRCodeImage')
    }
  },
  computed: {
    ...mapState('modal', ['data', 'qrLastLoad']),
    qrImageStyle() {
      return {
        backgroundImage: `url(${this.qrCodeUrl}?${this.qrLastLoad})`
      }
    },
    qrCodeUrl() {
      return client.getQRCodeUrl()
    }
  },
  mounted() {
    this.checkQRCodeImage()
    setInterval(this.checkQRCodeImage, 1000 * 60)
  },
  beforeDestroy() {
    clearInterval(this.checkQRCodeImage)
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
