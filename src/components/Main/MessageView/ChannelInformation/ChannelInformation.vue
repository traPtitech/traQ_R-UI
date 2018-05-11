<template lang="pug">
div.information
  OnlineUsers
  Notifications(v-show="!isDirectMessage && !isNotificationForced").channel-button
  div.channel-button(v-show="isNotificationForced")
    icon(name="exclamation")
  Pinned.channel-button
  Topic(v-show="!isDirectMessage").channel-button
  CreateChannel(v-show="!isDirectMessage").channel-button
  div.channel-button(v-show="!isDirectMessage && !isStared" @click="starChannel")
    icon(name="star")
  div.channel-button(v-show="!isDirectMessage && isStared" @click="unstarChannel")
    icon(name="star")
</template>

<script>
import client from '@/bin/client'
const asyncLoadComponents = component => {
  return () => {
    return component
      .then(data => {
        if (process.env.NODE_ENV) {
          console.log('async load component:', data.default.name)
        }
        return data
      })
  }
}
export default {
  name: 'ChannelInformation',
  components: {
    'OnlineUsers': asyncLoadComponents(import('@/components/Main/MessageView/ChannelInformation/WatchingUsers')),
    'Topic': asyncLoadComponents(import('@/components/Main/MessageView/ChannelInformation/Topic')),
    'Pinned': asyncLoadComponents(import('@/components/Main/MessageView/ChannelInformation/Pinned')),
    'Notifications': asyncLoadComponents(import('@/components/Main/MessageView/ChannelInformation/Notifications')),
    'CreateChannel': asyncLoadComponents(import('@/components/Main/MessageView/ChannelInformation/CreateChannel'))
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
    }
  }
}
</script>

<style lang="sass">
@import "~@/styles/global.sass"
.information
  grid-area: information
  display: flex
  flex-direction: column
  background-color: #c2c2c2
  border-left: 1px solid #B0B0B0
  z-index: $information-index
  @media only screen and (device-width : 375px) and (device-height : 812px) and (-webkit-device-pixel-ratio : 3) and (orientation: landscape)
    width: 40px
    padding-right: calc(env(safe-area-inset-right) - 7px)
.channel-button
  margin: 5px auto
  cursor: pointer
</style>
