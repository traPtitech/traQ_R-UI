<template lang="pug">
div.channel-activity-wrap
  div.channel-activity-box(@click="channelLink(channel.name)")
    div.channel-activity-channel
      div.channel-activity-before(:class="channelBeforeClass")
        | #
      div.channel-activity-name
      | {{ channel.name }}
    hr.channel-activity-separator
    p.channel-recent-message
      span.channel-recent-message-author
        | @{{ author.name }}
      span.channel-recent-message-content
        | {{ sanitizedMessage }}
</template>

<script>
import md from '@/bin/markdown-it'
export default {
  name: 'ChannelActivityElement',
  props: {
    model: Object
  },
  methods: {
    channelLink (name) {
      this.$router.push(`/channels/${this.$store.getters.getChannelPathById(this.channel.channelId)}`)
    }
  },
  computed: {
    channel () {
      return this.$store.state.channelMap[this.model.parentChannelId]
    },
    author () {
      return this.$store.state.memberMap[this.model.userId]
    },
    unreadNum () {
      return this.$store.getters.getChannelUnreadMessageNum(this.channel.channelId)
    },
    channelBeforeClass () {
      return { 'has-unread': this.unreadNum > 0 }
    },
    parsed () {
      const parsed = md.parseInline(this.model.content)
      return parsed[0].children
    },
    sanitizedMessage () {
      const parsed = md.parseInline(this.model.content)
      const tokens = parsed[0].children
      const message = []
      for (let token of tokens) {
        if (token.type === 'traq_extends_link_open') {
          if (token.meta.type === 'user') {
            message.push(' user: ')
          }
          if (token.meta.type === 'channel') {
            message.push(' channel: ')
          }
          if (token.meta.type === 'tag') {
            message.push(' tag: ')
          }
          if (token.meta.type === 'file') {
            message.push(` [file: ${token.attrs[1][1]}]`)
          }
        } else if (token.type === 'regexp-0') {
          // emoji
          message.push(token.meta.match[0])
        } else if (token.type === 'softbreak') {
          // newline
          message.push(' ')
        } else {
          message.push(token.content)
        }
      }
      return message.join('')
    }
  }
}
</script>

<style lang="sass">
.channel-activity-wrap
  display: block
.channel-activity-box
  position: relative
  margin: 0 0
  cursor: pointer
  padding: 16px
  word-break: break-all;
  border-bottom: 1px solid rgba(0,0,0,0.1)
  &:hover
    background: rgba(0,0,0,0.1)
.channel-activity-channel
  display: flex
  position: relative
  color: $text-light-color
  margin-bottom: 8px
  font-weight: bold
  flex: 1
  text-align: left
  cursor: pointer
  overflow: hidden
  white-space: nowrap
  z-index: 1
  user-select: none
  height: 18px
.channel-activity-before
  position: relative
  display: flex
  justify-content: center
  align-items: center
  width: 20px
  height: 20px
  color: $text-light-color
  margin-right: 0.5rem
  font:
    weight: bold
    size: 1.5rem;
  .channel-watched &
    color: $primary-color
  &.has-unread::after
    content: ''
    position: absolute
    display: block
    width: 7px
    height: 7px
    right: -3px
    top: -3px
    border-radius: 100%
    background: $notification-color
.channel-activity-separator
  border-color: rgba(255, 255, 255, 0.5)
  margin-left: 1.5rem

.channel-recent-message
  margin-left: 1.5rem
  max-height: 2rem
  font-size: 0.9rem
  overflow: hidden
  text-overflow: ellipsis
.channel-recent-message-author
  font-weight: bold;
  margin-right: 1rem

.channel-status-wrap
  width: 50px
  display: flex
.channel-notification
  flex: 1
.channel-toggle
  border: solid 1px $text-light-color
  border-radius: 5px
  &.has-unread-child
    border:
      color: $notification-color
      width: $notification-color
  .channel-opened &
    background: $text-light-color
    color: $primary-color
  .channel-watched &
    border-color: $primary-color
  .channel-watched.channel-opened &
    background: $primary-color
    color: $text-light-color
    border-color: $primary-color
.list-complete-enter-active, .list-complete-leave-active
  transition: all .2s ease
.list-complete-enter, .list-complete-leave-to
  opacity: 0
  transform: translateX(-5px)
</style>
