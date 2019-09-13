<template lang="pug">
div.channel-activity-wrap
  div.channel-activity-box(@click="channelLink()"
                           :class="{'activity-watched': isWatched}")
    div.channel-activity-channel
      div.channel-activity-before(:class="channelBeforeClass")
        icon-hash(size="16" :color="isWatched ? 'var(--primary-color)' : 'white'")
      div.channel-activity-name.text-ellipsis(:title="'#' + channelName")
        | {{ shortChannelName }}
    hr.channel-activity-separator
    p.channel-recent-message
      span.channel-recent-message-author.text-ellipsis
        | @{{ authorName }}
      span.channel-recent-message-content.text-ellipsis(v-html="sanitizedMessage")
      span.channel-recent-message-attachment-info(v-if="hasFile")
        icon-attach(:color="isWatched ? 'var(--primary-color)' : 'white'")
      span.channel-recent-message-attachment-info(v-if="hasMessage")
        icon-speech-balloon(:color="isWatched ? 'var(--primary-color)' : 'white'")
</template>

<script>
import { renderInline } from '@/bin/markdown-it'
import { detectFiles } from '@/bin/utils'
import IconAttach from '@/components/Icon/IconAttach'
import IconSpeechBalloon from '@/components/Icon/IconSpeechBalloon'
import IconHash from '@/components/Icon/IconHash'

export default {
  name: 'ChannelActivityElement',
  components: {
    IconAttach,
    IconSpeechBalloon,
    IconHash
  },
  props: {
    model: Object
  },
  methods: {
    channelLink() {
      this.$store.commit('closeSidebar')
      this.$store.commit('contractTitlebar')
      this.$router.push(
        `/channels/${this.$store.getters.getChannelPathById(
          this.model.parentChannelId
        )}`
      )
    }
  },
  computed: {
    channelName() {
      return this.$store.getters.getChannelPathById(this.model.parentChannelId)
    },
    shortChannelName() {
      return this.$store.getters.getShortChannelPathById(
        this.model.parentChannelId
      )
    },
    authorName() {
      return this.$store.state.memberMap[this.model.userId].name
    },
    unreadNum() {
      return this.$store.getters.getChannelUnreadMessageNum(
        this.model.parentChannelId
      )
    },
    isWatched() {
      return (
        this.$store.state.currentChannel.channelId ===
        this.model.parentChannelId
      )
    },
    channelBeforeClass() {
      return { 'has-unread': this.unreadNum > 0 }
    },
    attachments() {
      return detectFiles(this.model.content)
    },
    hasMessage() {
      return this.attachments.filter(a => a.type === 'message').length > 0
    },
    hasFile() {
      return this.attachments.filter(a => a.type === 'file').length > 0
    },
    sanitizedMessage() {
      return renderInline(this.model.content)
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
  padding:
    top: 12px
    bottom: 12px
    right: 16px
    left: 16px
  word-break: break-all
  border-bottom: 1px solid rgba(0,0,0,0.1)
  color: white
  &:hover
    background: rgba(0,0,0,0.1)
  &.activity-watched
    background: white
    color: $primary-color

.channel-activity-channel
  display: flex
  position: relative
  color: $text-light-color
  font-weight: bold
  flex: 1
  text-align: left
  cursor: pointer
  white-space: nowrap
  z-index: 1
  user-select: none
  height: 24px

.channel-activity-before
  position: relative
  top: 4px
  width: 16px
  height: 16px
  margin-right: 0.5rem

  .activity-watched &
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

.channel-activity-name
  width: 100%
  line-height: 1.4em
  .activity-watched &
    color: $primary-color

.channel-activity-separator
  border:
    top:
      style: solid
      width: 1px
      color: rgba(255, 255, 255, 0.5)
    left: none
    right: none
    bottom: none
  margin:
    top: 2px
    bottom: 2px
    left: 1.5rem
  .activity-watched &
    border-top-color: $primary-color
    opacity: 0.5

.channel-recent-message
  margin-left: 1.5rem
  max-height: 2.8rem
  line-height: 1.4em
  font-size: 0.9rem
  overflow: hidden
  text-overflow: ellipsis

.channel-recent-message-author
  display: inline-block
  font-weight: bold
  margin-right: 1rem

.channel-recent-message-content
  display: inline-block
  .emoji
    font-size: 24px
    vertical-align: top

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

.channel-recent-message-attachment-info
  margin-left: 1rem
</style>
