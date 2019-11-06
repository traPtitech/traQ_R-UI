<template lang="pug">
.footer
  footer-calling(v-if="$store.getters['rtc/isCalling']")
  footer-main
</template>

<script>
import FooterMain from '@/components/Main/Sidebar/Footer/FooterMain'
import FooterCalling from '@/components/Main/Sidebar/Footer/FooterCalling'

export default {
  components: {
    FooterMain,
    FooterCalling
  }
}
</script>

<style lang="sass">
.footer
  position: relative
  width: 100%
  background: $secondary-color
  contain: content
</style>
