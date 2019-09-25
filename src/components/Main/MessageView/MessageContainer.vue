<template lang="pug">
.message-container(ref="container")
  .content-wrap.is-scroll(
    @scroll.passive="onScroll"
    :class="{'is-fixed': isFixed && !supportOverflowAnchor}"
    ref="scroller")
    .message-list
      .message-item(v-for="(message, index) in messages" :key="message.messageId")
        time.date-partition(v-if="index === messages.length - 1 || date(messages[index + 1].createdAt) !== date(message.createdAt)")
          | {{date(message.createdAt)}}
        .new-message-partition(v-if="new Date(message.createdAt) - updateDate === 0")
          span
            | 新規メッセージ
        message-element(:model="message")
      .message-no-more-message(v-if="noMoreMessage")
        | これ以上メッセージはありません
  transition(name="transition-loading-indicator")
    .message-loading-indicator(v-if="messageLoading")
      span
        | 読み込み中
</template>

<script>
import { rendererManager, toggleSpoiler } from '@/bin/markdown'
import MessageElement from './MessageElement/MessageElement'
import { throttle } from 'lodash'

export default {
  name: 'MessageContainer',
  data() {
    return {
      messageLoading: false,
      noMoreMessage: false,
      isFirstView: true,
      isFixed: false
    }
  },
  components: {
    MessageElement
  },
  created() {
    this.$store.commit('loadEndComponent')
  },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (
        mutation.type === 'setMessages' ||
        mutation.type === 'unshiftMessages'
      ) {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
      if (mutation.type === 'addMessages') {
        if (
          state.messages[state.messages.length - 1].userId === state.me.userId
        ) {
          //自分がメッセージ投稿時
          this.$nextTick(() => {
            this.$refs.scroller.scrollTop = this.$refs.scroller.scrollHeight
          })
        }
      }
    })
    this.$refs.container.addEventListener('click', toggleSpoiler)
  },
  beforeDestroy() {
    this.$refs.container.removeEventListener('click', toggleSpoiler)
  },
  methods: {
    onScroll: throttle(function(event) {
      if (this.noMoreMessage) {
        return
      }
      if (event.target.scrollTop <= 0) {
        this.loadMessages()
      }
    }, 300),
    loadMessages: throttle(async function() {
      if (this.messageLoading) return

      this.messageLoading = true
      this.isFixed = true
      this.noMoreMessage = false

      const currentScrollTop = this.$refs.scroller.scrollTop
      const currentScrollHeight = this.$refs.scroller.scrollHeight

      await this.$store.dispatch('getMessages').then(res => {
        console.log('getMessages:', res)
        if (!res) {
          this.noMoreMessage = true
        }
      })

      this.$nextTick(() => {
        const newScrollHeight = this.$refs.scroller.scrollHeight
        console.log(currentScrollTop, currentScrollHeight, newScrollHeight)
        this.$refs.scroller.scrollTop =
          currentScrollTop + (newScrollHeight - currentScrollHeight)
        this.isFixed = false
        this.messageLoading = false
      })
    }, 800),
    date(datetime) {
      const d = new Date(datetime)
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
    },
    scrollToBottom() {
      if (this.isFirstView) {
        this.$refs.scroller.scrollTop = this.$refs.scroller.scrollHeight
        this.isFirstView = false
      }
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
    },
    supportOverflowAnchor() {
      return CSS.supports('overflow-anchor', 'auto')
    }
  },
  watch: {
    currentChannel(val, oldVal) {
      this.messageLoading = false
      this.noMoreMessage = false
      this.isFirstView = true
      rendererManager.stop(oldVal.channelId)
    }
  }
}
</script>

<style lang="sass">
.message-container
  position: relative
  display: block
  width: 100%
  height: 100%
  overflow: hidden

.content-wrap
  display: block
  position: relative
  background-color: $background-color
  width: 100%
  height: 100%
  overflow-x: hidden
  overflow-y: scroll
  overflow-anchor: auto
  min-width: 0

  &.is-fixed
    overflow-y: hidden

.message-list
  display: flex
  flex-direction: column-reverse
  width: 100%
  padding:
    top: 60px
    right: 0
    left: 0
    bottom: 30px

.message-no-more-message
  margin: 15px 0
  text-align: center

.message-load-more-point
  position: absolute
  top: 0
  width: 100%
  height: 40vh
  pointer-events: none

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

.message-loading-indicator
  position: absolute
  top: 48px
  left: 0
  width: 100%
  text-align: center
  padding: 24px 0

  span
    padding: 4px 16px
    color: white
    background: var(--primary-color)
    border:
      radius: 9999vw
    box-shadow: 0 0 0 4px var(--background-color)

.transition-loading-indicator
  &-enter, &-leave-to
    opacity: 0
    transform: translateY(-10px)

  &-enter-active, &-leave-active
    transition: opacity .3s, transform .3s
</style>
