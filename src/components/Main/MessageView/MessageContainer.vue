<template lang="pug">
content.content-wrap(@scroll="checkLoad")
  ol.message-list
    li.no-more-message(v-if="noMoreMessage")
      | これ以上メッセージはありません
    li.message-item(v-for="(message, index) in $store.state.messages" :key="message.messageId")
      time.date-partition(v-if="index === 0 || date($store.state.messages[index - 1].createdAt) !== date(message.createdAt)")
        | {{date(message.createdAt)}}
      p(v-if="new Date(message.createdAt) - updateDate === 0")
        | ここから新規メッセージ
      MessageElement(:model="message")
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
      if (!this.lastEvent) {
        this.lastEvent = {timeStamp: event.timeStamp, scrollTop: event.target.scrollTop}
        return
      }
      const diff = event.target.scrollTop - this.lastEvent.scrollTop
      const time = event.timeStamp - this.lastEvent.timeStamp
      const speed = Math.max(diff / time, -1.0)
      if ((event.target.scrollTop + speed * 1000 < 0 || event.target.scrollTop === 0) && !this.messageLoading) {
        this.messageLoading = true
        this.loadMessages()
      }
      this.lastEvent = {timeStamp: event.timeStamp, scrollTop: event.target.scrollTop}
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
  }
}
</script>

<style lang="sass">
.content-wrap
  grid-area: content
  background-color: $light-bg-color
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
  font-weight: bold
  position: relative
  margin: 5px 0 10px
  text-align: center
  &:before, &:after
    content: ''
    display: block
    height: 1px
    width: calc( 50% - 60px )
    top: 50%
    background-color: #cacaca
    position: absolute
  &:before
    left: 10px
  &:after
    right: 10px
.message-list
  padding: 0
</style>
