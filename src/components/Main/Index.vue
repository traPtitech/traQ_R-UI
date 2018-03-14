<template lang="pug">
FileDroper(@dropFile="dropFile" :onDragStyle="'{background-color: #fff;}'").index
  Titlebar
  Message
  Information
  Sidebar
</template>

<script>
import sse from '@/bin/sse'
import indexedDB from '@/bin/indexeddb'
import client from '@/bin/client'
import Message from '@/components/Main/MessageView/MessageContainer'
import FileDroper from '@/components/Util/FileDroper'
const db = indexedDB.db

export default {
  name: 'index',
  data () {
    return {
      heartbeat: null
    }
  },
  components: {
    'Sidebar': window.asyncLoadComponents(import('@/components/Main/Sidebar/Sidebar')),
    'Titlebar': window.asyncLoadComponents(import('@/components/Main/MessageView/Titlebar')),
    'Message': Message,
    'Information': window.asyncLoadComponents(import('@/components/Main/MessageView/ChannelInformation/ChannelInformation')),
    'FileDroper': FileDroper
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
    console.log(process.env.NODE_ENV)

    sse.startListen()
    sse.on('USER_JOINED', () => this.$store.dispatch('updateMembers'))
    sse.on('USER_LEFT', () => this.$store.dispatch('updateMembers'))
    sse.on('USER_TAGS_UPDATE', () => this.$store.dispatch('updateTags'))
    sse.on('USER_ICON_UPDATED', () => this.$store.dispatch('updateMembers'))
    sse.on('CHANNEL_CREATED', () => this.$store.dispatch('updateChannels'))
    sse.on('CHANNEL_DELETED', () => this.$store.dispatch('updateChannels'))
    sse.on('CHANNEL_UPDATED', () => this.$store.dispatch('updateChannels'))
    sse.on('CHANNEL_STARED', () => this.$store.dispatch('updateStaredChannels'))
    sse.on('CHANNEL_UNSTARED', () => this.$store.dispatch('updateStaredChannels'))
    sse.on('CHANNEL_VISIBILITY_CHANGED', () => {})
    sse.on('MESSAGE_CREATED', this.messageCreated)
    sse.on('MESSAGE_UPDATED', this.messageUpdated)
    sse.on('MESSAGE_DELETED', this.messageDeleted)
    sse.on('MESSAGE_READ', () => this.$store.dispatch('updateUnreadMessages'))
    sse.on('MESSAGE_STAMPED', (data) => this.$store.commit('updateMessageStamp', data))
    sse.on('MESSAGE_UNSTAMPED', (data) => this.$store.commit('deleteMessageStamp', data))
    sse.on('MESSAGE_PINNED', () => this.$store.dispatch('updateCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId))
    sse.on('MESSAGE_UNPINNED', () => this.$store.dispatch('updateCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId))
    sse.on('MESSAGE_CLIPPED', () => this.$store.dispatch('updateClipedMessages'))
    sse.on('MESSAGE_UNCLIPPED', () => this.$store.dispatch('updateClipedMessages'))
    sse.on('STAMP_CREATED', () => this.$store.dispatch('updateStamps'))
    sse.on('STAMP_DELETED', () => this.$store.dispatch('updateStamps'))
    sse.on('TRAQ_UPDATED', () => location.reload(true))

    this.heartbeat = setInterval(() => {
      client.postHeartbeat(this.getStatus(), this.$store.state.currentChannel.channelId)
      .then(res => {
        this.$store.commit('updateHeartbeatStatus', res.data)
      })
    }, 3000)

    window.ononline = async () => {
      if (sse.readyState === 2) {
        sse.startListen()
      }

      const currentChannel = this.$store.state.currentChannel
      this.$store.commit('changeChannel', currentChannel)
      await this.$store.dispatch('getMessages')
      .then(() => {
        this.$store.dispatch('getCurrentChannelTopic', currentChannel.channelId)
        this.$store.dispatch('getCurrentChannelPinnedMessages', currentChannel.channelId)
        this.$store.dispatch('getCurrentChannelNotifications', currentChannel.channelId)
      })

      // 起動後すぐ必要なもの
      Promise.all([
        this.$store.dispatch('updateChannels'),
        this.$store.dispatch('updateMembers')
      ])

      // 起動後すぐには必要ないもの
      Promise.all([
        this.$store.dispatch('updateClipedMessages'),
        this.$store.dispatch('updateStaredChannels'),
        this.$store.dispatch('updateUnreadMessages'),
        this.$store.dispatch('updateTags'),
        this.$store.dispatch('updateStamps')
      ])
    }

    this.$store.subscribe(async mutation => {
      if (mutation.type === 'addMessages') {
        if (!this.$el) {
          await this.$nextTick()
        }
        const container = this.$el.querySelector('.content-wrap')
        await this.$nextTick()
        if (container.scrollHeight - container.scrollTop < 1000) {
          container.scrollTop = container.scrollHeight
        }
      }

      if (mutation.type === 'setMessages') {
        if (!this.$el) {
          await this.$nextTick()
        }
        const container = this.$el.querySelector('.content-wrap')
        await this.$nextTick()
        container.scrollTop = container.scrollHeight
      }

      if (mutation.type === 'unshiftMessages') {
        if (!this.$el) {
          await this.$nextTick()
        }
        const container = this.$el.querySelector('.content-wrap')
        const height = container.scrollHeight
        await this.$nextTick()
        container.scrollTop = container.scrollHeight - height
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
        const channel = this.$store.state.channelMap[res.data.parentChannelId]
        if (user.userId === this.$store.state.me.userId) {
          if (!this.$store.state.messages.find(m => m.messageId === data.id)) {
            if (channel.channelId === this.$store.state.currentChannel.channelId) {
              this.$store.commit('addMessages', res.data)
            }
          }
          return
        }
        const title = this.$store.getters.getChannelPathById(channel.channelId)
        const options = {
          icon: client.getUserIconUrl(user.userId),
          body: user.name + ':' + res.data.content
        }
        const notification = this.notify(title, options)
        notification.onclick = () => {
          window.focus()
          this.$router.push(title)
        }

        if (channel.channelId === this.$store.state.currentChannel.channelId) {
          this.$store.commit('addMessages', res.data)
        }
      })
    },
    messageUpdated (data) {
      client.getMessage(data.id)
      .then(res => {
        this.$store.commit('updateMessage', res.data)
      })
    },
    messageDeleted (data) {
      this.$store.commit('deleteMessage', data.id)
    },
    notify (title, options, channelName) {
      if (Notification.permission === 'granted') {
        // eslint-disable-next-line no-new
        return new Notification(title, options)
      }
      return null
    },
    dropFile (files) {
      this.$store.commit('setFiles', files)
    }
  },
  watch: {
    '$route.params.channel': function () {
      client.postHeartbeat(this.getStatus(), this.$store.state.currentChannel.channelId)
      .then(res => {
        this.$store.commit('updateHeartbeatStatus', res.data)
      })
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

*
  animation: fadein 0.3s ease 0s 1 normal;

@keyframes fadein 
  0% {opacity: 0}
  100% {opacity: 1}
</style>
