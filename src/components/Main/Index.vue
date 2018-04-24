<template lang="pug">
FileDroper(@dropFile="dropFile" :onDragStyle="'{background-color: #fff;}'").index
  Titlebar
  Message
  Information
  Sidebar
  User
  Tag
  StampPicker
</template>

<script>
import sse from '@/bin/sse'
import client from '@/bin/client'
import Message from '@/components/Main/MessageView/MessageContainer'
import FileDroper from '@/components/Util/FileDroper'
import User from '@/components/Main/User'
import Tag from '@/components/Main/Tag'
import StampPicker from '@/components/Main/StampPicker'

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
    'FileDroper': FileDroper,
    'User': User,
    'Tag': Tag,
    'StampPicker': StampPicker
  },
  async created () {
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
        while (!this.$el) {
          await this.$nextTick()
        }
        const container = this.$el.querySelector('.content-wrap')
        await this.$nextTick()
        container.scrollTop = container.scrollHeight
      }

      if (mutation.type === 'unshiftMessagesss') {
        const container = this.$el.querySelector('.content-wrap')
        const top = container.scrollTop
        const beforeHeight = container.scrollHeight
        setTimeout(() => {
          container.scrollTop = container.scrollHeight - beforeHeight + top
        }, 5)
      }
    })

    if (!this.$route.params.channel) {
      if (!this.$route.params.user) {
        this.$router.push('/channels/random')
      }
    }

    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission(permission => {
          if (permission === 'granted') {
            this.notify('ようこそtraQへ！！')
          }
        })
      }
      const messaging = window.firebase.messaging()
      messaging.requestPermission()
        .then(() => {
          console.log('permission granted')
          messaging.getToken()
            .then(currentToken => {
              console.log(currentToken)
              client.registerDevice(currentToken)
            })
        })
        .catch(() => {
          console.error('permission denied')
        })

      messaging.onTokenRefresh(() => {
        messaging.getToken()
          .then(currentToken => {
            client.registerDevice(currentToken)
          })
      })
    }

    window.onfocus = () => {
      console.log('on focus')
      if (!sse.isListening()) {
        sse.startListen(() => {
          console.log('sse reconnect')
          this.$store.dispatch('getMessages', true)
        })
      }
    }

    console.log(sse.isListening())
    if (!sse.isListening()) {
      sse.startListen(() => {
        this.$store.dispatch('getMessages', true)
      })
      sse.resetEventListener()
      sse.on('USER_JOINED', () => this.$store.dispatch('updateMembers'))
      sse.on('USER_LEFT', () => this.$store.dispatch('updateMembers'))
      sse.on('USER_TAGS_UPDATED', (data) => this.userTagsUpdated(data))
      sse.on('USER_ICON_UPDATED', (data) => this.userIconUpdated(data))
      sse.on('CHANNEL_CREATED', () => this.$store.dispatch('updateChannels'))
      sse.on('CHANNEL_DELETED', () => this.$store.dispatch('updateChannels'))
      sse.on('CHANNEL_UPDATED', () => this.$store.dispatch('updateChannels'))
      sse.on('CHANNEL_STARED', () => this.$store.dispatch('updateStaredChannels'))
      sse.on('CHANNEL_UNSTARED', () => this.$store.dispatch('updateStaredChannels'))
      sse.on('CHANNEL_VISIBILITY_CHANGED', () => this.$store.dispatch('updateChannels'))
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
    }

    this.heartbeat = setInterval(() => {
      if (this.$store.state.channelId !== this.$store.state.directMessageId) {
        client.postHeartbeat(this.getStatus(), this.$store.state.currentChannel.channelId)
        .then(res => {
          this.$store.commit('updateHeartbeatStatus', res.data)
        })
      } else {
        this.$store.commit('updateHeartbeatStatus', {userStatuses: [{userId: this.$store.state.me.userId, status: 'none'}], channelId: ''})
      }
    }, 3000)

    while (!this.$el) {
      await this.$nextTick()
    }
    const container = this.$el.querySelector('.content-wrap')
    await this.$nextTick()
    container.scrollTop = container.scrollHeight
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
        .then(async res => {
          let user = this.$store.state.memberMap[res.data.userId]
          let channel = this.$store.state.channelMap[res.data.parentChannelId]
          if (!channel) {
            channel = await client.getChannelInfo(res.data.parentChannelId).data
          }
          let path = ''
          let title = ''
          if (channel.parent === this.$store.state.directMessageId) {
            let user = this.$store.state.me.name
            channel.member.forEach(userId => {
              if (userId !== this.$store.state.me.userId) {
                user = this.$store.state.memberMap[userId].name
              }
            })
            title = `@${user}`
            path = `users/${user}`
          } else {
            title = `#${this.$store.getters.getChannelPathById(channel.channelId)}`
            path = `channels/${this.$store.getters.getChannelPathById(channel.channelId)}`
          }
          if (channel.channelId === this.$store.state.currentChannel.channelId) {
            this.$store.commit('addMessages', res.data)
            if (document.hasFocus()) {
              client.readMessages([res.data.messageId])
            }
          }

          if (!document.hasFocus() || channel.channelId !== this.$store.state.currentChannel.channelId) {
            const options = {
              icon: client.getUserIconUrl(user.userId),
              body: user.name + ':' + res.data.content
            }
            const notification = this.notify(title, options)
            if (notification) {
              notification.onclick = () => {
                window.focus()
                this.$router.push(path)
              }
            }
          }
          this.$store.dispatch('updateUnreadMessages')
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
    userIconUpdated (data) {
      console.log(data)
      if (data.id === this.$store.state.me.userId) {
        this.$store.dispatch('whoAmI')
      }
      this.$store.dispatch('updateMembers')
    },
    userTagsUpdated (data) {
      if (this.$store.state.userModal && data.id === this.$store.state.userModal.userId) {
        this.$store.dispatch('updateCurrentUserTags')
      }
      this.$store.dispatch('updateTags')
    },
    notify (title, options, channelName) {
      if (window.Notification) {
        if (Notification.permission === 'granted') {
          // eslint-disable-next-line no-new
          return new Notification(title, options)
        }
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
  @media only screen and (device-width : 375px) and (device-height : 812px) and (-webkit-device-pixel-ratio : 3)
    grid-template-columns: calc(260px + env(safe-area-inset-left) - 7px) 1fr calc(40px + env(safe-area-inset-right) - 7px)

</style>
