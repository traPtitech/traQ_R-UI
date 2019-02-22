<template lang="pug">
content.content-wrap.is-scroll(@scroll="checkLoad")
  ol.message-list
    li.no-more-message(v-if="noMoreMessage")
      | これ以上メッセージはありません
    li.message-item(v-for="(message, index) in $store.state.messages" :key="message.messageId")
      time.date-partition(v-if="index === 0 || date($store.state.messages[index - 1].createdAt) !== date(message.createdAt)")
        | {{date(message.createdAt)}}
      div.new-message-partition(v-if="new Date(message.createdAt) - updateDate === 0")
        span
          | 新規メッセージ
      MessageElement(:model="message")
  div
</template>

<script>
import MessageElement from '@/components/Main/MessageView/MessageElement/MessageElement'
export default {
  name: 'MessageContainer',
  data () {
    return {
      messageLoading: false,
      noMoreMessage: false,
      lastEvent: null
    }
  },
  components: {
    'MessageElement': MessageElement
  },
  created () {
    this.$store.commit('loadEndComponent')
  },
  methods: {
    loadMessages () {
      this.$store.dispatch('getMessages')
        .then(res => {
          if (res) {
            setTimeout(() => {
              this.messageLoading = false
            }, 500)
          } else {
            this.noMoreMessage = true
          }
        })
    },
    date (datetime) {
      const d = new Date(datetime)
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
    },
    checkLoad (event) {
      if (!this.lastEvent || this.lastEvent.channelId !== this.$store.state.currentChannel.channelId) {
        this.lastEvent = {timeStamp: event.timeStamp, scrollTop: event.target.scrollTop, channelId: this.$store.state.currentChannel.channelId}
        return
      }
      const diff = event.target.scrollTop - this.lastEvent.scrollTop
      const time = event.timeStamp - this.lastEvent.timeStamp
      const speed = Math.max(diff / time, -1.0)
      if ((event.target.scrollTop + speed * 1000 < 0 || event.target.scrollTop === 0) && !this.messageLoading) {
        this.messageLoading = true
        this.loadMessages()
      }
      this.lastEvent = {timeStamp: event.timeStamp, scrollTop: event.target.scrollTop, channelId: this.$store.state.currentChannel.channelId}
    }
  },
  watch: {
    nowChannel () {
      this.messageLoading = false
    }
  },
  computed: {
    nowChannel () {
      return this.$store.state.currentChannel
    },
    updateDate () {
      return this.$store.getters.getCurrentChannelUpdateDate
    }
  },
  async mounted () {
    while (!this.$el) {
      await this.$nextTick()
    }
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'addMessages') {
        if (this.$el && state.messages[state.messages.length - 1].userId === state.me.userId) {
          this.$el.scrollTop = this.$el.scrollHeight
        }
      }
    })
  }
}
</script>

<style lang="sass">
.content-wrap
  +mq(pc)
    grid-area: content
  +mq(sp)
    display: block
    height: 100vh
    height: vh(100)
  background-color: $background-color
  overflow-x: hidden
  overflow-y: scroll
  min-width: 0
  -webkit-overflow-scrolling: touch

.message-wrap
  width: 100%
  height: 100%
  z-index: 10
  top: 0
  left: 0

.sticky-container
  height: 100%
  width: 100%
  top: 0
  left: 0
  z-index: 20
  pointer-events: none

.no-more-message
  margin: 15px 0
  text-align: center

.message-item

.date-partition
  display: inline-block
  width: 100%
  font:
    weight: normal
    size: 0.9em
  position: relative
  margin: 5px 0 10px
  text-align: center
  &:before, &:after
    content: ''
    display: block
    height: 1px
    width: calc( 50% - 70px )
    top: 50%
    opacity: 0.6
    background-color: #cacaca
    position: absolute
  &:before
    left: 10px
  &:after
    right: 10px

.new-message-partition
  position: relative
  width: 100%

  span
    display: inline-block
    position: relative
    font:
      weight: bold
      size: 0.8em
    color: $notification-color
    border:
      width: 1px
      style: solid
      color: $notification-color
      radius: 3px
    padding: 2px 4px
    margin:
      left: 10px

  &:after
    content: ''
    display: block
    position: absolute
    width: calc( 100% - 135px )
    height: 1px
    background-color: $notification-color
    top: 50%
    right: 15px

.message-list
  padding:
    top: 60px
    right: 0
    left: 0
    bottom: 50px
</style>
