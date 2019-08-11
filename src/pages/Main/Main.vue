<template lang="pug">
action-detector(
  @dropFile = "dropFile"
  @swipeStart = "swipeStart"
  @swipeMoving = "swipeMoving"
  @swipeEnd = "swipeEnd"
  :onDragStyle = "'{background-color: #fff;}'")
  picker-modal
  modal
  .index(:data-enable-blur="name ? 'true' : 'false'")
    titlebar
    channel-information
    sidebar(:swipeEvent="swipeEvent")
    message-view
</template>

<script>
import { mapState } from 'vuex'
import sse from '@/bin/sse'
import client from '@/bin/client'
import ActionDetector from '@/components/Util/ActionDetector'
import MessageView from '@/components/Main/MessageView'
import Sidebar from '@/components/Main/Sidebar/Sidebar'
import firebase from 'firebase/app'

export default {
  name: 'Main',
  metaInfo() {
    return {
      title: this.title
    }
  },
  data() {
    return {
      heartbeat: null,
      heartbeatPending: false,
      swipeEvent: {
        isActive: false,
        startX: Number,
        startY: Number,
        x: Number,
        y: Number
      },
      nowStatus: 'none'
    }
  },
  components: {
    Titlebar: window.asyncLoadComponents(
      import('@/components/Main/MessageView/Titlebar')
    ),
    ChannelInformation: window.asyncLoadComponents(
      import('@/components/Main/MessageView/InformationSidebar/InformationSidebar')
    ),
    PickerModal: window.asyncLoadComponents(
      import('@/components/Main/PickerModal')
    ),
    Sidebar,
    MessageView,
    Modal: window.asyncLoadComponents(import('@/components/Main/Modal')),
    ActionDetector
  },
  async created() {
    if (!this.$route.params.channel) {
      if (!this.$route.params.user) {
        this.$router.push('/channels/general')
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
    }

    if (
      process.env.NODE_ENV === 'production' &&
      'navigator' in window &&
      'serviceWorker' in window.navigator
    ) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(regisration => {
          console.log('Service Worker Registered!')
          regisration.update()
          const messaging = firebase.messaging()
          messaging.useServiceWorker(regisration)
          Notification.requestPermission(result => {
            if (result === 'denied') {
              console.error('permission denied')
              return
            } else if (result === 'default') {
              console.error('permission default')
              return
            }
            console.log('permission granted')
            messaging.getToken().then(currentToken => {
              client.registerDevice(currentToken)
            })

            messaging.onMessage(payload => {
              const notification = this.notify(
                payload.data.title || 'traQ',
                payload.data
              )
              if (notification) {
                notification.onclick = () => {
                  window.focus()
                  this.$router.push(payload.data.path)
                }
              }
            })
          })

          messaging.onTokenRefresh(() => {
            messaging.getToken().then(currentToken => {
              client.registerDevice(currentToken)
            })
          })
        })

      window.navigator.serviceWorker.addEventListener('message', data => {
        if (data.data.type === 'navigate') {
          this.$router.push(data.data.to)
        }
      })
    }

    const userAgent = window.navigator.userAgent
    if (userAgent.includes('traQ-Android')) {
      const token = window.Bridge.getFCMToken()
      if (token) {
        console.log('register:' + token)
        client.registerDevice(token)
      }
    } else if (userAgent.includes('traQ-iOS')) {
      const token = window.iOSToken
      if (token) {
        console.log('register:' + token)
        client.registerDevice(token)
      }
    }

    window.onfocus = () => {
      console.log('on focus')
      if (!sse.isListening()) {
        sse.startListen(() => {
          console.log('sse reconnect')
          this.$store.dispatch('getMessages', true)
          this.$store.dispatch('updateUnreadMessages')
        })
      }
    }

    console.log(sse.isListening())
    if (!sse.isListening()) {
      sse.startListen(() => {
        this.$store.dispatch('getMessages', true)
      })
      sse.resetEventListener()
      sse.on('USER_JOINED', () => this.userJoined())
      sse.on('USER_LEFT', () => this.$store.dispatch('updateMembers'))
      sse.on('USER_TAGS_UPDATED', data => this.userTagsUpdated(data))
      sse.on('USER_GROUP_UPDATED', data => this.userGroupUpdated(data))
      sse.on('USER_ICON_UPDATED', data => this.userIconUpdated(data))
      sse.on('USER_ONLINE', data =>
        this.$store.dispatch('updateUserOnline', {
          userId: data.id,
          isOnline: true
        })
      )
      sse.on('USER_OFFLINE', data =>
        this.$store.dispatch('updateUserOnline', {
          userId: data.id,
          isOnline: false
        })
      )
      sse.on('CHANNEL_CREATED', data =>
        this.$store.dispatch('addChannel', data.id)
      )
      sse.on('CHANNEL_DELETED', data =>
        this.$store.dispatch('deleteChannel', data.id)
      )
      sse.on('CHANNEL_UPDATED', data => this.channelUpdated(data.id))
      sse.on('CHANNEL_STARED', () =>
        this.$store.dispatch('updateStaredChannels')
      )
      sse.on('CHANNEL_UNSTARED', () =>
        this.$store.dispatch('updateStaredChannels')
      )
      sse.on('CHANNEL_VISIBILITY_CHANGED', () =>
        this.$store.dispatch('updateChannels')
      )
      sse.on('MESSAGE_CREATED', this.messageCreated)
      sse.on('MESSAGE_UPDATED', this.messageUpdated)
      sse.on('MESSAGE_DELETED', this.messageDeleted)
      sse.on('MESSAGE_READ', this.messageRead)
      sse.on('MESSAGE_STAMPED', data =>
        this.$store.commit('updateMessageStamp', data)
      )
      sse.on('MESSAGE_UNSTAMPED', data =>
        this.$store.commit('deleteMessageStamp', data)
      )
      sse.on('MESSAGE_PINNED', () =>
        this.$store.dispatch(
          'getCurrentChannelPinnedMessages',
          this.$store.state.currentChannel.channelId
        )
      )
      sse.on('MESSAGE_UNPINNED', () =>
        this.$store.dispatch(
          'getCurrentChannelPinnedMessages',
          this.$store.state.currentChannel.channelId
        )
      )
      sse.on('MESSAGE_CLIPPED', () =>
        this.$store.dispatch('updateClipedMessages')
      )
      sse.on('MESSAGE_UNCLIPPED', () =>
        this.$store.dispatch('updateClipedMessages')
      )
      sse.on('STAMP_CREATED', data => this.$store.dispatch('addStamp', data.id))
      sse.on('STAMP_DELETED', () => this.$store.dispatch('updateStamps'))
      sse.on('TRAQ_UPDATED', () => location.reload(true))
    }

    this.heartbeat = setInterval(() => {
      if (this.$store.state.channelId !== this.$store.state.directMessageId) {
        if (this.heartbeatPending) return
        this.heartbeatPending = true
        client
          .postHeartbeat(
            this.getStatus(),
            this.$store.state.currentChannel.channelId
          )
          .then(res => {
            this.$store.commit('updateHeartbeatStatus', res.data)
          })
          .finally(() => {
            this.heartbeatPending = false
          })
      } else {
        this.$store.commit('updateHeartbeatStatus', {
          userStatuses: [
            { userId: this.$store.state.me.userId, status: 'none' }
          ],
          channelId: ''
        })
      }
    }, 3000)

    while (!this.$el) {
      await this.$nextTick()
    }
    const container = this.$el.querySelector('.content-wrap')
    await this.$nextTick()
    container.scrollTop = container.scrollHeight
  },
  beforeDestroy() {
    sse.stopListen()
    clearInterval(this.heartbeat)
  },
  methods: {
    getStatus() {
      if (this.$store.state.editing) {
        this.nowStatus = 'editing'
      } else if (document.hasFocus()) {
        this.nowStatus = 'monitoring'
      } else {
        this.nowStatus = 'none'
      }
      return this.nowStatus
    },
    messageCreated(data) {
      client.getMessage(data.id).then(async res => {
        let channel = this.$store.state.channelMap[res.data.parentChannelId]
        if (!channel) {
          channel = (await client.getChannelInfo(res.data.parentChannelId)).data
        }
        if (
          channel.dm &&
          this.$store.state.memberMap[
            this.$store.state.currentChannel.channelId
          ]
        ) {
          if (
            channel.member.some(
              userId => userId === this.$store.state.currentChannel.channelId
            )
          ) {
            this.$store.commit('addMessages', res.data)
            if (document.hasFocus()) {
              client.readMessages(res.data.parentChannelId)
            }
          } else {
            this.$store.commit('addUnreadMessage', res.data)
          }
        } else {
          if (
            channel.channelId === this.$store.state.currentChannel.channelId
          ) {
            this.$store.commit('addMessages', res.data)
            if (document.hasFocus()) {
              client.readMessages(res.data.parentChannelId)
            }
          } else {
            if (
              this.$store.state.myNotifiedChannelSet.has(
                res.data.parentChannelId
              )
            ) {
              this.$store.commit('addUnreadMessage', res.data)
            }
          }
        }

        // [NOTE] MESSAGE_CREATEDは通知ONのチャンネルにしか起きないので通知でフィルタリングする必要がない
        this.$store.commit('addActivityMessages', res.data)
      })
    },
    messageUpdated(data) {
      client.getMessage(data.id).then(res => {
        this.$store.commit('updateMessage', res.data)
      })
      this.$store.dispatch('checkPinnedMessage', data.id)
    },
    messageDeleted(data) {
      this.$store.commit('deleteMessage', data.id)
      this.$store.dispatch('checkPinnedMessage', data.id)
    },
    messageRead(data) {
      this.$store.commit('readChannel', data.id)
    },
    channelUpdated(channelId) {
      if (this.$store.state.currentChannel.channelId === channelId) {
        this.$store.dispatch('getChannelTopic', channelId)
      }
      this.$store.dispatch('updateChannel', channelId)
    },
    userIconUpdated(data) {
      console.log(data)
      if (data.id === this.$store.state.me.userId) {
        this.$store.dispatch('whoAmI')
      }
      this.$store.dispatch('updateMembers')
    },
    userTagsUpdated(data) {
      if (
        this.$store.state.userModal &&
        data.id === this.$store.state.userModal.userId
      ) {
        this.$store.dispatch('updateCurrentUserTags')
      }
    },
    userGroupUpdated() {
      this.$store.dispatch('updateGroups')
    },
    notify(title, options) {
      if (window.Notification) {
        if (Notification.permission === 'granted') {
          // eslint-disable-next-line no-new
          return new Notification(title, options)
        }
      }
      return null
    },
    dropFile(files) {
      this.$store.commit('setFiles', files)
    },
    swipeStart(event) {
      this.swipeEvent.startX = event.touches.item(0).clientX
      this.swipeEvent.startY = event.touches.item(0).clientY
    },
    swipeMoving(event) {
      this.swipeEvent.isActive = true
      this.swipeEvent.x = event.touches.item(0).clientX
      this.swipeEvent.y = event.touches.item(0).clientY
    },
    swipeEnd() {
      this.swipeEvent.isActive = false
    },
    userJoined() {
      this.$store.dispatch('updateMembers')
      this.$store.dispatch('updateWebhooks')
    }
  },
  watch: {
    '$route.params.channel': function() {
      if (this.heartbeatPending) return
      this.heartbeatPending = true
      client
        .postHeartbeat(
          this.getStatus(),
          this.$store.state.currentChannel.channelId
        )
        .then(res => {
          this.$store.commit('updateHeartbeatStatus', res.data)
        })
        .finally(() => {
          this.heartbeatPending = false
        })
    },
    nowStatus(newStatus) {
      if (newStatus === 'none') {
        return
      }
      if (
        this.$store.getters.getChannelUnreadMessageNum(
          this.$store.state.currentChannel.channelId
        ) > 0
      ) {
        this.$store.dispatch(
          'readMessages',
          this.$store.state.currentChannel.channelId
        )
      }
    }
  },
  computed: {
    ...mapState('modal', ['name']),
    title() {
      if (this.$route.params.user) return `@${this.$route.params.user}`
      if (!this.$route.params.channel) return ''
      let ret = '#'
      this.$route.params.channel
        .split('/')
        .slice(0, -1)
        .forEach(e => {
          ret += e.charAt(0) + '/'
        })
      ret += this.$store.state.currentChannel.name
      return ret
    }
  }
}
</script>

<style lang="sass">
.index
  position: absolute
  top: 0
  right: 0
  width: 100%
  height: 100%
  // height: vh(100)
  +mq(pc)
    display: flex
    flex-flow: row
  +mq(sp)
  @media only screen and (device-width : 375px) and (device-height : 812px) and (-webkit-device-pixel-ratio : 3) and (orientation: landscape)
    grid-template-columns: calc(260px + env(safe-area-inset-left) - 7px) 1fr calc(40px + env(safe-area-inset-right) - 7px)

  &[data-enable-blur="true"]
    transition: filter .2s linear
    filter: blur(2px)
</style>
