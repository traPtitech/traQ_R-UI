<template lang="pug">
.footer-calling
  .footer-calling-status
    .footer-calling-indicator
      icon-call(size="24")
    router-link.footer-calling-channel(:to="callingFullPath")
      .footer-calling-channel-state
        | 通話中
      .footer-calling-channel-name
        | {{ callingPath }}
  .footer-calling-actions.footer-button-wrap
    .menu-button(@click="$store.dispatch('rtc/closeConnection', $store.state.rtc.activeMediaChannelId)")
      icon-call-end(size="24")
    .menu-button(v-if="$store.state.rtc.isMicMuted" @click="$store.dispatch('rtc/unmuteLocalStream')")
      icon-mic-off(size="24")
    .menu-button(v-else @click="$store.dispatch('rtc/muteLocalStream')")
      icon-mic(size="24")
</template>

<script>
import version from '@/version'
import IconCall from '@/components/Icon/IconCall'
import IconCallEnd from '@/components/Icon/IconCallEnd'
import IconMic from '@/components/Icon/IconMic'
import IconMicOff from '@/components/Icon/IconMicOff'

export default {
  components: {
    IconCall,
    IconCallEnd,
    IconMic,
    IconMicOff
  },
  methods: {},
  computed: {
    callingPath() {
      return this.$store.getters.getShortChannelPathById(
        this.$store.state.rtc.activeMediaChannelId
      )
    },
    callingFullPath() {
      return (
        '/channels/' +
        this.$store.getters.getChannelPathById(
          this.$store.state.rtc.activeMediaChannelId
        )
      )
    }
  }
}
</script>

<style lang="sass">
.footer-calling
  height: $footer-height
  width: 100%
  background: $secondary-color
  display: flex
  align-items: center
  justify-content: space-between
  border-bottom: 1px solid rgba(255, 255, 255, 0.1)

.footer-calling-status
  display: flex
  align-items: center

.footer-button-wrap
  margin: 0 15px
  display: flex

.menu-button
  cursor: pointer
  margin-left: 1rem
  color: white
  &:hover
    opacity: 0.8

.footer-calling-indicator
  margin-left: 20px

.footer-calling-channel
  user-select: none
  cursor: pointer
  color: white
  margin-left: 20px
  &:hover
    opacity: 0.8

.footer-calling-channel-state
  color: white
  font-weight: bold
  font-size: 1rem

.footer-calling-channel-name
  color: white
  font-size: 0.8rem
</style>
