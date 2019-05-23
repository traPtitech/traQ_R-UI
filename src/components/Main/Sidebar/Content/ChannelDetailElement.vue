<template lang="pug">
.channel-detail-element-wrapper(@click="channelLink" :class="channelDetailElementClass")
  .channel-detail-element-box
    .channel-detail-element-before-wrap
      .channel-detail-element-before(:class="channelBeforeClass")
        | #
    p.channel-detail-element-box-name
      | {{shortChannelName}}
  .channel-detail-element-topic-wrapper(v-if="hasTopic")
    .channel-detail-element-topic-icon.flex-center
      icon-topic(size="18" :color="iconColor")
    p.channel-detail-element-topic.text-ellipsis
      | {{this.model.topic}}
</template>

<script>
import IconTopic from '@/components/Icon/IconTopic'

export default {
  name: 'ChannelDetailElement',
  components: {
    IconTopic
  },
  props: {
    model: Object
  },
  methods: {
    channelNameById(channelId) {
      return this.$store.state.channelMap[channelId].name
    },
    channelLink() {
      this.$store.commit('closeSidebar')
      this.$store.commit('contractTitlebar')
      this.$router.push(
        `/channels/${this.$store.getters.getChannelPathById(
          this.model.channelId
        )}`
      )
    }
  },
  computed: {
    channelDetailElementClass() {
      return {
        'channel-opened': this.isOpened,
        'channel-watched': this.isWatched
      }
    },
    fullChannelName() {
      return this.$store.getters.getChannelPathById(this.model.channelId)
    },
    shortChannelName() {
      return this.$store.getters.getShortChannelPathById(this.model.channelId)
    },
    isWatched() {
      return this.$store.state.currentChannel.channelId === this.model.channelId
    },
    unreadNum() {
      return this.$store.getters.getChannelUnreadMessageNum(
        this.model.parentChannelId
      )
    },
    channelBeforeClass() {
      return {
        'has-unread': this.unreadNum > 0,
        'has-unread-child':
          !this.isOpened && this.unreadSum - this.unreadNum > 0,
        'channel-notified': this.isNotified
      }
    },
    isOpened() {
      return this.$store.state.openChannels[this.model.channelId]
    },
    isNotified() {
      return this.$store.state.myNotifiedChannelSet.has(this.model.channelId)
    },
    hasTopic() {
      return this.model.topic.length > 0
    },
    iconColor() {
      return this.isWatched ? 'var(--primary-color)' : 'white'
    }
  }
}
</script>

<style lang="sass">
.channel-detail-element-wrapper
  cursor: pointer

  &:hover
    background: rgba(0,0,0,0.1)

  &.channel-watched
    background: white

.channel-detail-element-box
  display: flex
  position: relative
  align-items: center
  justify-content: space-between
  margin: 0 0

.channel-detail-element-box-name
  position: relative
  color: $text-light-color
  font-weight: bold
  flex: 1
  padding:
    top: 8px
    right: 10px
    bottom: 8px
    left: 2px
  text-align: left
  cursor: pointer
  overflow:
    x: hidden
  white-space: nowrap
  text-overflow: ellipsis
  z-index: 1
  user-select: none
  height: 34px

  .channel-watched &
    color: $primary-color
  &:after
    display: block
    position: absolute
    content: ''
    top: 0
    width: 0
    height: 0
    background-color: black
    border-radius: 100%
    z-index: 2

.channel-detail-element-before-wrap
  height: 34px
  display: flex
  align-items: center
  padding:
    right: 8px

.channel-detail-element-before
  position: relative
  display: flex
  justify-content: center
  align-items: center
  width: 20px
  height: 20px
  line-height: 1px //for safari
  padding:
    top: 0
    bottom: 1px
  color: $text-light-color
  margin: 0 0 0 10px
  font-weight: bold
  .channel-watched &
    color: $primary-color
  &.channel-notified:not(.has-unread)::after
    content: ''
    position: absolute
    display: block
    width: 8px
    height: 8px
    right: -3px
    top: -3px
    border-radius: 100%
    background: rgba(255, 255, 255, 0.3)
    border: 2px solid $primary-color
  &.channel-notified.channel-toggle:not(.has-unread)::before
    content: ''
    position: absolute
    display: block
    width: 8px
    height: 8px
    right: -3px
    top: -3px
    border-radius: 100%
    background: $primary-color
  .channel-watched &.channel-notified:not(.has-unread)::before
    background: white
    opacity: 1
  .channel-watched &.channel-notified:not(.has-unread)::after
    background-color: $primary-color
    border: 2px solid white
    opacity: 0.3

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

.channel-detail-element-topic-wrapper
  display: flex
  align-items: center
  padding:
    left: 14px
    right: 6px
    bottom: 6px
  opacity: 0.9

.channel-detail-element-topic
  color: $text-light-color
  padding:
    left: 4px
  font-size: 0.9em
  line-height: 1.4em

  .channel-watched &
    color: $primary-color

.channel-detail-element-topic-icon
  flex-shrink: 0
</style>
