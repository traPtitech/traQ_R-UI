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
            IconLogo(color="white" size="22")
          | SETTINGS
        ul.setting-page-list
          li.setting-page-list-item(:class="{active: active === 'profile'}" @click="active = 'profile'")
            .setting-page-list-item-icon
              IconProfile(color="white" size="22")
            | プロフィール設定
          li.setting-page-list-item(:class="{active: active === 'browser'}" @click="active = 'browser'")
            .setting-page-list-item-icon
              IconWrench(color="white" size="22")
            | ブラウザ設定
          li.setting-page-list-item(:class="{active: active === 'call'}" @click="active = 'call'")
            .setting-page-list-item-icon
              IconCall(color="white" size="22")
            | 通話設定
          li.setting-page-list-item(:class="{active: active === 'stamp'}" @click="active = 'stamp'")
            .setting-page-list-item-icon
              IconStamp(color="white" size="22")
            | スタンプ設定
      .setting-page-container.is-scroll(v-if="windowWidth >= 750")
        transition(name="fade" mode="out-in")
          keep-alive
            ProfileSetting(v-if="active === 'profile'")
            BrowserSetting(v-if="active === 'browser'")
            CallSetting(v-if="active === 'call'")
            StampSetting(v-if="active === 'stamp'")
      .setting-page-all-container.is-scroll
          ProfileSetting
          BrowserSetting
          CallSetting
          StampSetting
</template>

<script>
import ProfileSetting from '@/pages/Setting/ProfileSetting'
import BrowserSetting from '@/pages/Setting/BrowserSetting'
import StampSetting from '@/pages/Setting/StampSetting'
import CallSetting from '@/pages/Setting/CallSetting'
import IconBack from '@/components/Icon/IconBack'
import IconLogo from '@/components/Icon/IconLogo'
import IconProfile from '@/components/Icon/IconProfile'
import IconWrench from '@/components/Icon/IconWrench'
import IconStamp from '@/components/Icon/IconStamp'
import IconCall from '@/components/Icon/IconCall'
export default {
  name: 'Setting',
  components: {
    ProfileSetting,
    BrowserSetting,
    StampSetting,
    CallSetting,
    IconBack,
    IconLogo,
    IconProfile,
    IconWrench,
    IconStamp,
    IconCall
  },
  data() {
    return { active: 'profile', windowWidth: 0 }
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    },
    back() {
      if (
        this.$store.state.currentChannel.parent ===
        this.$store.state.directMessageId
      ) {
        this.$router.push(`/users/${this.$store.state.currentChannel.name}`)
      } else if (this.$store.state.currentChannel['channelId']) {
        this.$router.push(
          `/channels/${this.$store.getters.getChannelPathById(
            this.$store.state.currentChannel.channelId
          )}`
        )
      } else {
        this.$router.push('/channels/random')
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  }
}
</script>

<style lang="sass">
$header-height: 3rem
.setting-page
  position: absolute
  background-color: $setting-background-color
  height: 100%
  color: $text-color
.setting-header
  position: absolute
  display: flex
  align-items: center
  width: 100%
  height: $header-height
  background-color: $primary-color
  color: white
  padding: 1rem
  user-select: none

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
  @media (max-width: 750px)
    height: 95%
    width: 95%
  max-width: 75rem
  display: flex
  background-color: $background-color
  border-radius: $modal-border-radius

.setting-page-container
  position: relative
  margin-left: -1rem
  padding: 2rem
  overflow-y: scroll
  flex: 1
  display: block
  -webkit-overflow-scrolling: touch
  contain: strict
  @media (max-width: 750px)
    display: none

.setting-page-all-container
  padding: 1rem
  flex: 1
  overflow-y: scroll
  display: none
  -webkit-overflow-scrolling: touch
  @media (max-width: 750px)
    display: block
  > *:not(:last-child)
    margin-bottom: 2rem


.setting-menu
  @media (max-width: 750px)
    display: none
  height: calc(100% + 2rem)
  width: 17rem
  top: -1rem
  left: -1rem
  position: relative
  background-color: $primary-color
  color: white
  border-radius: 5px
  padding: 3rem 1rem
  user-select: none

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
