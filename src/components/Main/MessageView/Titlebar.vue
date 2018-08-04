<template lang="pug">
header.titlebar(ref="titlebar" :class="{'is-expanded':isExpanded}")
  div.titlebar-inner-wrap(@click="isExpanded=!isExpanded")
    // div.sidebar-open(v-on:click="$store.state.sidebarOpened=!$store.state.sidebarOpened")
    //   icon(name="bars").sidebar-open-icon
    img.traq-logo(src="@/assets/img/icon/logo_white.svg")
    div.channel-info-wrap(ref="titlebarInner")
      h1.text-ellipsis.channel-name
        | {{title}}
      p.channel-topic-text(:key="title" v-bind:class="{'has-topic': topic}")
        | {{topic}}
  div.titlebar-expand.drop-shadow
    div.titlebar-menu-button-wrap
      div.titlebar-menu-button
        img.menu-icon(src="@/assets/img/icon/notif.svg")
      div.titlebar-menu-button.border-left(v-show="!isDirectMessage && !isStared" @click="starChannel")
        img.menu-icon(src="@/assets/img/icon/star.svg")
      div.titlebar-menu-button.border-left(v-show="!isDirectMessage && isStared" @click="unstarChannel")
        img.menu-icon(src="@/assets/img/icon/star_fill.svg")
    div.titlebar-menu-item(v-show="!isDirectMessage")
      img.menu-icon(src="@/assets/img/icon/notif_fill.svg")
      span
        | チャンネル通知設定
    div.titlebar-menu-item(v-show="!isDirectMessage")
      img.menu-icon(src="@/assets/img/icon/edit.svg")
      span
        | トピック変更
    div.titlebar-menu-item(v-show="!isDirectMessage")
      img.menu-icon(src="@/assets/img/icon/plus.svg")
      span
        | チャンネル作成
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'Titlebar',
  data () {
    return {
      isSidebarOpened: false,
      isExpanded: false,
      width: 0
    }
  },
  methods: {
    starChannel () {
      client.starChannel(this.$store.state.currentChannel.channelId)
      .then(() => {
        this.$store.dispatch('updateStaredChannels')
      })
    },
    unstarChannel () {
      client.unstarChannel(this.$store.state.currentChannel.channelId)
      .then(() => {
        this.$store.dispatch('updateStaredChannels')
      })
    },
    removeWidth () {
      this.$refs.titlebarInner.style.width = ''
    },
    zeroWidth () {
      this.$refs.titlebarInner.style.width = '0px'
    }
  },
  computed: {
    isDirectMessage () {
      return this.$store.state.currentChannel.parent === this.$store.state.directMessageId
    },
    isNotificationForced () {
      return this.$store.state.currentChannel.force
    },
    isStared () {
      if (this.isDirectMessage) return false
      if (this.$store.state.staredChannelMap[this.$store.state.currentChannel.channelId]) return true
      return false
    },
    title () {
      if (this.$route.params.user) return `@${this.$route.params.user}`
      if (!this.$route.params.channel) return ''
      let ret = '#'
      this.$route.params.channel.split('/').slice(0, -1).forEach(e => {
        ret += e.charAt(0) + '/'
      })
      ret += this.$store.state.currentChannel.name
      return ret
    },
    topic () {
      if (this.$route.params.user) return ''
      return this.$store.state.currentChannelTopic.text
    }
  },
  watch: {
  }
}
</script>

<style lang="sass">
$topic-height: 14px

.titlebar
  position: fixed
  display: inline-block
  z-index: $titlebar-index
  transition: all .3s ease
  +mq(pc)
    left: $sidebar-width
    min-width: 230px
    max-width: calc( 100vw - #{$sidebar-width} - #{$online-users-box-width} - 5px )
    height: 60px
  +mq(sp)
    // top: 10px
    min-width: 200px
    max-width: calc( 100vw - #{$online-users-box-width} - 5px )
    height: 50px
.titlebar-inner-wrap
  +mq(pc)
    height: 60px
  +mq(sp)
    height: 50px
  display: flex
  align-items: center
  justify-content: flex-start
  color: white
  cursor: pointer
  transition: all .5s ease
  background: $primary-color
  position: relative
  &::before
    content: ''
    position: absolute
    bottom: 0
    left: 0
    right: 0
    display: block
    margin: auto
    width: 0
    height: 1px
    background: $border-color
    transition: width .5s ease
    .is-expanded &
      width: calc( 100% - 20px )
.sidebar-open-icon
  width: 60%
  height: 60%
  color: gray
.channel-info-wrap
  padding-right: 10px
  max-width: calc( 100% - 60px )
.channel-name
  max-width: 100%
  font-size: 25px
  line-height: 30px
  font-weight: bold
  text-align: left
  margin: 0
.buttons
  display: flex
  flex-flow: row
  div
    width: 50px
    height: 50px
    margin: 10px
.channel-topic-text
  font-size: 13px
  height: 0
  overflow: hidden
  +mq(sp)
    display: none
  transition: height .5s ease
  &.has-topic
    height: $topic-height
  &::before
    content: ''
    display: block
    position: absolute
    left: 0
    top: 0
    width: 0
    height: 100%
    background: white
    z-index: $titlebar-index
.titlebar-expand
  display: flex
  z-index: -1
  position: relative
  flex-flow: column
  justify-content: center
  padding: 0 0 10px
  background: $primary-color
  transition: all .5s ease
  overflow: hidden
  position: relative
  transform: translateY(-100%)
  .is-expanded &
    transform: translateY(0)
.titlebar-menu-button-wrap
  display: flex
  justify-content: center
  height: 50px
  max-width: 230px
  .titlebar-menu-button
    display: flex
    justify-content: center
    width: 50%
    cursor: pointer
.border-left
  position: relative
  &::after
    content: ''
    display: block
    position: absolute
    width: 1px
    height: 60%
    top: 0
    bottom: 0
    left: 0
    margin: auto
    background: $border-color
.titlebar-menu-item
  display: flex
  align-items: center
  width: 100%
  height: 20px
  padding: 10px 0 10px 30px
  color: white
  font-size: 14px
  cursor: pointer
  .menu-icon
    margin-right: 15px
.traq-logo
  width: 30px
  height: 30px
  margin: 0 10px 0 15px
</style>
