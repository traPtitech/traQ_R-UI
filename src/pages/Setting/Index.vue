<template lang="pug">
.setting-page
  .setting-header.drop-shadow
    .back-to-traq(@click="back")
      .back-to-traq-icon-wrap
        IconBack(color="white")
      .back-to-traq-text-wrap traQへ戻る
  .setting-container-wrap
    .setting-container.drop-shadow
      .setting-menu.drop-shadow
        .setting-title-container
          .setting-traq-logo
            IconLogo(color="white" :size="22")
          | SETTINGS
        ul.setting-page-list
          li.setting-page-list-item(:class="{active: active === 0}" @click="active = 0")
            .setting-page-list-item-icon
              IconPin(color="white" :size="22")
            | プロフィール設定
          li.setting-page-list-item(:class="{active: active === 1}" @click="active = 1")
            .setting-page-list-item-icon
              IconTag(color="white" :size="22")
            | ブラウザ設定
          li.setting-page-list-item(:class="{active: active === 2}" @click="active = 2")
            .setting-page-list-item-icon
              IconTopic(color="white" :size="22")
            | スタンプ設定
      .setting-page-container
        transition(name="fade" mode="out-in")
          keep-alive
            ProfileSetting(v-if="active === 0")
            BrowserSetting(v-if="active === 1")
            StampSetting(v-if="active === 2")
</template>

<script>
import ProfileSetting from '@/components/Setting/ProfileSetting'
import BrowserSetting from '@/components/Setting/BrowserSetting'
import StampSetting from '@/components/Setting/StampSetting'
import IconBack from '@/components/Icon/IconBack'
import IconLogo from '@/components/Icon/IconLogo'
import IconPin from '@/components/Icon/IconPin'
import IconTag from '@/components/Icon/IconTag'
import IconTopic from '@/components/Icon/IconTopic'
export default {
  name: 'Setting',
  components: {
    ProfileSetting,
    BrowserSetting,
    StampSetting,
    IconBack,
    IconLogo,
    IconPin,
    IconTag,
    IconTopic
  },
  data () {
    return { active: 0 }
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
.setting-page
  background-color: $setting-background-color
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
  height: 85%
  width: 90%
  display: flex
  background-color: $background-color
  border-radius: $modal-border-radius
.setting-page-container
  padding: 2rem
  overflow: scroll
  flex: 1

.setting-menu
  height: calc(100% + 2rem)
  width: 17rem
  top: -1rem
  left: -1rem
  position: relative
  background-color: $primary-color
  color: white
  border-radius: 5px
  padding: 3rem 1rem

.setting-title-container
  display: flex
  align-items: center
  justify-content: center
  margin: 1rem 0
  font-size: 1.3rem
  letter-spacing: 0.2rem
  .setting-traq-logo
    margin-right: 1.25rem

.setting-page-list
  margin-top: 5rem
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
.setting-page-list-item
  display: flex
  flex-direction: row
  align-items: center
  width: 70%
  margin: 1.75rem 0
  cursor: pointer
  opacity: 0.5
.setting-page-list-item:hover,
.setting-page-list-item.active
  opacity: 1
.setting-page-list-item-icon
  margin-right: 1rem

.fade-enter-active, .fade-leave-active
  transition: opacity .1s
.fade-enter, .fade-leave-to 
  opacity: 0
</style>
