<template lang="pug">
div.index
  Titlebar
  Message
  Information
  Sidebar
</template>

<script>
import Sidebar from '@/components/Main/Sidebar/Sidebar'
import Titlebar from '@/components/Main/MessageView/Titlebar'
import Message from '@/components/Main/MessageView/MessageContainer'
import Information from '@/components/Main/MessageView/ChannelInformation/ChannelInformation'
import sse from '@/bin/sse'
import client from '@/bin/client'

export default {
  name: 'index',
  data () {
    return {
      heartbeat: null
    }
  },
  components: {
    'Sidebar': Sidebar,
    'Titlebar': Titlebar,
    'Message': Message,
    'Information': Information
  },
  async created () {
    if (!this.$route.params.channel) {
      this.$router.push('/channels/random')
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission(permission => {
        if (permission === 'granted') {
          this.notify('ようこそtraQへ！！')
        }
      })
    }

    sse.startListen()
    sse.on('USER_JOINED', () => this.$store.dispatch('updateMembers'))
    sse.on('USER_LEFT', () => this.$store.dispatch('updateMembers'))
    sse.on('USER_TAGS_UPDATE', () => {})
    sse.on('USER_ICON_UPDATED', () => {})
    sse.on('CHANNEL_CREATED', () => this.$store.dispatch('updateChannels'))
    sse.on('CHANNEL_DELETED', () => this.$store.dispatch('updateChannels'))
    sse.on('CHANNEL_UPDATED', () => this.$store.dispatch('updateChannels'))
    sse.on('CHANNEL_STARED', () => this.$store.dispatch('updateStaredChannels'))
    sse.on('CHANNEL_UNSTARED', () => this.$store.dispatch('updateStaredChannels'))
    sse.on('CHANNEL_VISIBILITY_CHANGED, () => {}')
    sse.on('MESSAGE_CREATED', this.messageCreated)
    sse.on('MESSAGE_UPDATED', this.messageUpdated)
    sse.on('MESSAGE_DELETED', this.messageDeleted)
    sse.on('MESSAGE_READ', () => {})
    sse.on('MESSAGE_STAMPED', () => {})
    sse.on('MESSAGE_UNSTAMPED', () => {})
    sse.on('MESSAGE_PINNED', () => this.$store.dispatch('updateCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId))
    sse.on('MESSAGE_UNPINNED', () => this.$store.dispatch('updateCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId))
    sse.on('MESSAGE_CLIPPED', () => this.$store.dispatch('updateClipedMessages'))
    sse.on('MESSAGE_UNCLIPPED', () => this.$store.dispatch('updateClipedMessages'))
    sse.on('STAMP_CREATED', () => {})
    sse.on('STAMP_DELETED', () => {})
    sse.on('TRAQ_UPDATED', () => location.reload(true))

    this.heartbeat = setInterval(() => {
      client.postHeartbeat(this.getStatus(), this.$store.state.currentChannel.channelId)
      .then(res => {
        this.$store.commit('updateHeartbeatStatus', res.data)
      })
    }, 3000)

    this.$store.subscribe(async mutation => {
      const container = this.$el.querySelector('.content-wrap')
      await this.$nextTick()
      if (mutation.type === 'addMessages') {
        if (container.scrollHeight - container.scrollTop < 1000) {
          container.scrollTop = container.scrollHeight
        }
      }

      if (mutation.type === 'setMessages') {
        container.scrollTop = container.scrollHeight
      }
    })
  },
  beforeDestroy () {
    sse.stopListen()
    clearInterval(this.heartbeat)
  },
  methods: {
    getStatus () {
      if (this.$store.state.editing) {
        return 'editing'
      } else if (document.hasFocus()) {
        return 'monitoring'
      } else {
        return 'none'
      }
    },
    messageCreated (data) {
      client.getMessage(data.id)
      .then(res => {
        const user = this.$store.state.memberMap[res.data.userId]
        if (user.userId === this.$store.state.me.userId) {
          return
        }
        const channel = this.$store.state.channelMap[res.data.parentChannelId]
        const title = this.$store.getters.getChannelPathById(channel.channelId)
        const options = {
          icon: null,
          body: user.name + ':' + res.data.content
        }
        this.notify(title, options)

        if (channel.channelId === this.$store.state.currentChannel.channelId) {
          this.$store.commit('addMessages', res.data)
        }
      })
    },
    messageUpdated (data) {
      client.getMessage(data.id)
      .then(res => {
        // 自分のメッセージはすぐに更新しているため
        if (res.data.userId === this.$store.state.me.userId) {
          return
        }
        this.$store.commit('updateMessage', res.data)
      })
    },
    messageDeleted (data) {
      this.$store.commit('deleteMessage', data.id)
    },
    notify (title, options) {
      if (Notification.permission === 'granted') {
        // eslint-disable-next-line no-new
        return new Notification(title, options)
      }
      return null
    }
  }
}
</script>

<style lang="sass">
.index
  display: grid
  position: relative
  grid-gap: 0
  width: 100vw
  height: 100vh
  @media (min-width: 680px)
    grid-template-rows: 60px 1fr
    grid-template-columns: 260px 1fr 40px
    grid-template-areas: "side titlebar titlebar""side content information"
  @media (max-width: 679px)
    grid-template-rows: 60px 1fr
    grid-template-columns: 1fr 40px
    grid-template-areas: "titlebar titlebar""content information"
</style>
