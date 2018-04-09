<template lang="pug">
div.content-wrap(@scroll="checkLoad")
  div.sticky-container.sticky
    InputUI
  content.message-wrap
    ul.message-list
      li(v-if="noMoreMessage")
        | これ以上メッセージはありません
      li.message-item(v-for="(message, index) in $store.state.messages" :key="message.messageId")
        time.date-partition(v-if="index === 0 || date($store.state.messages[index - 1].datetime) !== date(message.datetime)")
          | {{date(message.datetime)}}
        MessageElement(:model="message" v-bind:key="message.messageId")
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
    'InputUI': window.asyncLoadComponents(import('@/components/Main/MessageView/InputUI')),
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
      if ((event.target.scrollTop + speed * 2500 < 0 || event.target.scrollTop === 0) && !this.messageLoading) {
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
    }
  }
}
</script>

<style lang="sass">
.content-wrap
  grid-area: content
  position: relative
  background-color: rgb(249, 249, 249)
  overflow: scroll
  -webkit-overflow-scrolling: touch
.message-wrap
  width: 100%
  height: 100%
  position: absolute
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
.message-item
  overflow: hidden
.date-partition
  display: inline-block
  width: 100%
  font-weight: bold
  position: relative
  margin: 5px 0 10px
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
  padding-bottom: 60px
</style>
