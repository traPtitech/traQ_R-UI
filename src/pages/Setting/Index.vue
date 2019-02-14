<template lang="pug">
div
  h1
    | setting
  ProfileSetting
  BrowserSetting
  StampSetting
  button(@click="back")
    | 戻る
</template>

<script>
import ProfileSetting from '@/components/Setting/ProfileSetting'
import BrowserSetting from '@/components/Setting/BrowserSetting'
import StampSetting from '@/components/Setting/StampSetting'
export default {
  name: 'Setting',
  components: {
    ProfileSetting,
    BrowserSetting,
    StampSetting
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
.setting-user-icon
  width: 100px
  height: 100px
  background-color: white
  border-radius: 100%
</style>
