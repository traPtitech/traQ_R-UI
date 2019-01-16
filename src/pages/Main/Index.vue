<template lang="pug">
FileDroper(
  @dropFile="dropFile"
  :onDragStyle="'{background-color: #fff;}'"
  )
  // User
  // Tag
  Modal
  .index(:data-enable-blur="name ? 'true' : 'false'")
    StampPicker
    Titlebar
    OnlineUsersList
    // ↓grid-item on pc
    Message
    Input
    Sidebar
</template>

<script>
import { mapState } from 'vuex'
import sse from '@/bin/sse'
import client from '@/bin/client'
import Message from '@/components/Main/MessageView/MessageContainer'
import FileDroper from '@/components/Util/FileDroper'
import User from '@/components/Main/User'
import Tag from '@/components/Main/Tag'
import StampPicker from '@/components/Main/StampPicker'
import Modal from '@/components/Main/Modal'

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
    'Input': window.asyncLoadComponents(import('@/components/Main/MessageView/Input')),
    'OnlineUsersList': window.asyncLoadComponents(import('@/components/Main/MessageView/OnlineUsersBox')),
    'FileDroper': FileDroper,
    'User': User,
    'Tag': Tag,
    'StampPicker': StampPicker,
    'Modal': Modal
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
              client.registerDevice(currentToken)
            })

          messaging.onMessage(payload => {
            const notification = this.notify(payload.data.title || 'traQ', payload.data)
            if (notification) {
              notification.onclick = () => {
                window.focus()
                this.$router.push(payload.data.path)
              }
            }
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

    const userAgent = window.navigator.userAgent
    if (userAgent.includes('traQ-Android')) {
      const token = window.Bridge.getFCMToken()
      console.log('register:' + token)
      client.registerDevice(token)
    }

    if ('navigator' in window && 'serviceWorker' in window.navigator) {
      window.navigator.serviceWorker.addEventListener('message', data => {
        if (data.data.type === 'navigate') {
          this.$router.push(data.data.to)
        }
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
      sse.on('USER_ONLINE', (data) => this.$store.dispatch('updateUserOnline', {userId: data.id, isOnline: true}))
      sse.on('USER_OFFLINE', (data) => this.$store.dispatch('updateUserOnline', {userId: data.id, isOnline: false}))
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
      sse.on('MESSAGE_PINNED', () => this.$store.dispatch('getCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId))
      sse.on('MESSAGE_UNPINNED', () => this.$store.dispatch('getCurrentChannelPinnedMessages', this.$store.state.currentChannel.channelId))
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
          let channel = this.$store.state.channelMap[res.data.parentChannelId]
          if (!channel) {
            channel = (await client.getChannelInfo(res.data.parentChannelId)).data
          }
          if (channel.dm && this.$store.state.memberMap[this.$store.state.currentChannel.channelId]) {
            if (channel.member.some(userId => userId === this.$store.state.currentChannel.channelId)) {
              this.$store.commit('addMessages', res.data)
              if (document.hasFocus()) {
                client.readMessages([res.data.messageId])
              }
            }
          } else {
            if (channel.channelId === this.$store.state.currentChannel.channelId) {
              this.$store.commit('addMessages', res.data)
              if (document.hasFocus()) {
                client.readMessages([res.data.messageId])
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
      this.$store.dispatch('checkPinnedMessage', data.id)
    },
    messageDeleted (data) {
      this.$store.commit('deleteMessage', data.id)
      this.$store.dispatch('checkPinnedMessage', data.id)
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
  },
  computed: {
    ...mapState('modal', ['name'])
  }
}
</script>

<style lang="sass">
.index
  position: relative
  grid-gap: 0
  width: 100vw
  height: 100vh
  +mq(pc)
    display: grid
    overflow: hidden
    grid-template-rows: 1fr $input-height
    grid-template-columns: $sidebar-width 1fr
    grid-template-areas: "side content""side input"
  +mq(sp)
    overflow: scroll
  @media only screen and (device-width : 375px) and (device-height : 812px) and (-webkit-device-pixel-ratio : 3) and (orientation: landscape)
    grid-template-columns: calc(260px + env(safe-area-inset-left) - 7px) 1fr calc(40px + env(safe-area-inset-right) - 7px)

  &[data-enable-blur="true"]
    transition: filter .2s linear
    filter: blur(3px)
</style>
