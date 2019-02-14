<template lang="pug">
.setting
  .setting-header.drop-shadow
    .back-to-traq(@click="back")
      .back-to-traq-icon-wrap
        IconBack(color="white")
      .back-to-traq-text-wrap traQへ戻る
  .setting-container-wrap
    .setting-container.drop-shadow
      ProfileSetting
      BrowserSetting
      StampSetting
</template>

<script>
import ProfileSetting from '@/components/Setting/ProfileSetting'
import BrowserSetting from '@/components/Setting/BrowserSetting'
import StampSetting from '@/components/Setting/StampSetting'
import IconBack from '@/components/Icon/IconBack'
export default {
  name: 'Setting',
  components: {
    ProfileSetting,
    BrowserSetting,
    StampSetting,
    IconBack
  },
  methods: {
    back () {
      if (this.$store.state.currentChannel['channelId']) {
        this.$router.push(`/channels/${this.$store.getters.getChannelPathById(this.$store.state.currentChannel.channelId)}`)
      } else {
        this.$router.push('/channels/random')
      }
    }
  }
}
</script>

<style lang="sass">
$header-height: 3rem
.setting
  background-color: ($primary-color)
  height: 100vh
  color: $text-color
.setting-header
  position: absolute
  display: flex
  align-items: center
  width: 100vw
  height: $header-height
  background-color: $primary-color
  color: white
  padding: 1rem

.back-to-traq
  display: flex
  cursor: pointer
.back-to-traq-icon-wrap
  margin-right: 1rem

.setting-container-wrap
  height: 100vh
  width: 100vw
  padding-top: $header-height
  display: flex
  align-items: center
  justify-content: center
.setting-container
  height: 90%
  width: 90%
  padding: 2rem
  overflow: scroll
  background-color: $background-color
  border-radius: $modal-border-radius
</style>
