<template lang="pug">
div.channel-wrap(v-if="model.visibility")
  div.channel-box(@click="channelLink" v-bind:class="{'channel-opened': isOpened, 'channel-watched': isWatched}")
    div.channel-before-wrap(v-if="isParent" @click.stop="toggle")
      div.channel-toggle.channel-before(:class="channelBeforeClass")
        | #
    div.channel-before-wrap(v-else)
      div.channel-before(:class="channelBeforeClass")
        | #
    p.channel-box-name
      | {{model.name}}
  div.channel-children(ref="children" v-if="model.children")
    transition(name="list-complete" @after-enter="removeHeight" @after-leave="zeroHeight")
      div(ref="childrenWrap" v-show="isOpened")
        div(v-for="child in children")
          ChannelElement(:model="child")
</template>

<script>
export default {
  name: 'ChannelElement',
  props: {
    model: Object
  },
  data() {
    return {
      height: '0'
    }
  },
  methods: {
    toggle() {
      this.$store.dispatch('updateChannelOpen', {
        channelId: this.model.channelId,
        isOpen: !this.isOpened
      })
    },
    channelLink() {
      this.$store.commit('closeSidebar')
      this.$store.commit('contractTitlebar')
      this.$router.push(
        `/channels/${this.$store.getters.getChannelPathById(
          this.model.channelId
        )}`
      )
    },
    removeHeight() {
      this.$refs.children.style.height = ''
    },
    zeroHeight() {
      this.$refs.children.style.height = '0'
    }
  },
  computed: {
    isParent() {
      return this.model.children && this.model.children.length > 0
    },
    isWatched() {
      return this.$store.state.currentChannel.channelId === this.model.channelId
    },
    unreadNum() {
      return this.$store.getters.getChannelUnreadMessageNum(
        this.model.channelId
      )
    },
    unreadSum() {
      return this.$store.getters.getChannelUnreadMessageSum(
        this.model.channelId
      )
    },
    isOpened() {
      return this.$store.state.openChannels[this.model.channelId]
    },
    channelBeforeClass() {
      return {
        'has-unread': this.unreadNum > 0,
        'has-unread-child':
          !this.isOpened && this.unreadSum - this.unreadNum > 0,
        'channel-notified': this.isNotified
      }
    },
    children() {
      if (!this.model.children) return []
      return this.model.children.map(c => {
        return this.$store.state.channelMap[c]
      })
    },
    isNotified() {
      return this.$store.state.myNotifiedChannelSet.has(this.model.channelId)
    }
  },
  watch: {
    isOpened: {
      handler() {
        this.$nextTick(() => {
          this.height = this.$refs.childrenWrap.clientHeight
          this.$refs.children.style.height = this.height + 'px'
        })
      }
    }
  }
}
</script>

<style lang="sass">
.channel-wrap
  display: block
.channel-box
  display: flex
  position: relative
  align-items: center
  justify-content: space-between
  margin: 0 0
  cursor: pointer
  &:hover
    background: rgba(0,0,0,0.1)
  &.channel-watched
    background: white
.channel-box-name
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
.channel-children
  position: relative
  padding: 0 0 0 0
  transition: all .2s ease
  will-change: height, padding
  &:before
    display: block
    content: ''
    position: absolute
    left: 20px
    width: 1px
    height: 0
    background: $text-light-color
    transition: height .2s ease
  .channel-opened + &
    padding-left: 20px
  .channel-opened + &:before
    height: calc( 100% - 5px )
.channel-status-wrap
  width: 50px
  display: flex
.channel-notification
  flex: 1
.channel-before-wrap
  height: 34px
  display: flex
  align-items: center
  padding:
    right: 8px
.channel-before
  position: relative
  display: flex
  justify-content: center
  align-items: center
  width: 20px
  height: 20px
  line-height: 1px //for safari
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
    background: white;
    opacity: 1;
  .channel-watched &.channel-notified:not(.has-unread)::after
    background-color: $primary-color;
    border: 2px solid white;
    opacity: 0.3;

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
