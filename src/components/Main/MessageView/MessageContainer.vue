<template lang="pug">
content.content-wrap.is-scroll
  .message-list
    .message-item(v-for="(message, index) in messages" :key="message.messageId")
      time.date-partition(v-if="index === messages.length - 1 || date(messages[index + 1].createdAt) !== date(message.createdAt)")
        | {{date(message.createdAt)}}
      .new-message-partition(v-if="new Date(message.createdAt) - updateDate === 0")
        span
          | 新規メッセージ
      message-element(:model="message" :isFirstView="isFirstView" @rendered="messageRendered")
    .message-loading.flex-center(v-if="messageLoading")
      | loading
    .message-no-more-message(v-if="noMoreMessage")
      | これ以上メッセージはありません
</template>

<script>
import MessageElement from './MessageElement/MessageElement'
import { debounce } from 'debounce'

export default {
  name: 'MessageContainer',
  data() {
    return {
      messageLoading: false,
      noMoreMessage: false,
      isFirstView: true
    }
  },
  components: {
    MessageElement
  },
  created() {
    this.$store.commit('loadEndComponent')
  },
  async mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'addMessages') {
        if (
          state.messages[state.messages.length - 1].userId === state.me.userId
        ) {
          this.$el.scrollTop = this.$el.scrollHeight
        }
      }
    })
  },
  methods: {
    loadMessages() {
      this.messageLoading = true
      this.noMoreMessage = false
      this.$store.dispatch('getMessages').then(res => {
        console.log('getMessages:', res)
        if (!res) {
          this.noMoreMessage = true
        }
        this.messageLoading = false
        this.scrollToBottom()
        this.$el.scrollTop += 300
        this.isFirstView = false
      })
    },
    date(datetime) {
      const d = new Date(datetime)
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
    },
    messageRendered() {
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    scrollToBottom() {
      if (!this.isFirstView) return
      this.$el.scrollTop = this.$el.scrollHeight
    }
  },
  computed: {
    currentChannel() {
      return this.$store.state.currentChannel
    },
    updateDate() {
      return this.$store.getters.getCurrentChannelUpdateDate
    },
    messages() {
      return this.$store.state.messages.slice().reverse()
    }
  },
  watch: {
    currentChannel() {
      this.messageLoading = false
      this.noMoreMessage = false
      this.isFirstView = true
    }
  }
}
</script>

<style lang="sass">
.content-wrap
  display: block
  background-color: $background-color
  height: 100%
  overflow-x: hidden
  overflow-y: scroll
  min-width: 0

.message-no-more-message
  margin: 15px 0
  text-align: center

.message-load-more-point
  position: absolute
  top: 0
  width: 100%
  height: 40vh
  pointer-events: none

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
  position: relative
  display: flex
  flex-direction: column-reverse
  padding:
    top: 60px
    right: 0
    left: 0
    bottom: 30px

.message-loading
  width: 100%
  height: 100px
</style>
