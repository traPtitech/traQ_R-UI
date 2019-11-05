<template lang="pug">
.channel-wrap(v-if="model.visibility")
  .channel-box(@click="channelLink" :class="{'channel-opened': isOpened, 'channel-watched': isWatched}" :title="'#' + fullChannelName")
    .channel-before-wrap(v-if="isParent" @click.stop="toggle")
      .channel-toggle.channel-before(:class="channelBeforeClass")
        icon-hash(v-if="!hasInputContent" size="12" :color="toggleChannelHashColor")
        icon-pen(v-else size="12" :color="toggleChannelHashColor")
    .channel-before-wrap(v-else)
      .channel-before(:class="channelBeforeClass")
        icon-hash(v-if="!hasInputContent" size="12" :color="channelHashColor")
        icon-pen(v-else size="12" :color="channelHashColor")
    p.channel-box-name
      | {{channelName}}
  .channel-children-wrapper(ref="children")
    transition-group.channel-children(
      tag="div"
      v-if="model.children"
      name="list-complete"
      @after-enter="removeHeight"
      @after-leave="zeroHeight")
      .channel-children-space(v-show="isOpened" @click="toggle" key="space")
      .channel-children-container(ref="childrenContainer" v-show="isOpened" key="container")
        div(v-for="child in children" :key="child.channelId")
          ChannelElement(:model="child" :isChild="true")
</template>

<script>
import IconHash from '@/components/Icon/IconHash'
import IconPen from '@/components/Icon/IconPen'

export default {
  name: 'ChannelElement',
  props: {
    model: Object,
    isChild: {
      type: Boolean,
      default: false
    }
  },
  components: { IconHash, IconPen },
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
      // 子チャンネルの高さに合わせるため
      this.$refs.children.style.height = ''
    },
    zeroHeight() {
      this.$refs.children.style.height = '0'
    }
  },
  computed: {
    channelName() {
      return !this.isChild && this.model.isDuplicated
        ? this.shortChannelName
        : this.model.name
    },
    fullChannelName() {
      return this.$store.getters.getChannelPathById(this.model.channelId)
    },
    shortChannelName() {
      let ret = ''
      this.fullChannelName
        .split('/')
        .slice(0, -1)
        .forEach(e => {
          ret += e.charAt(0) + '/'
        })
      return ret + this.model.name
    },
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
    },
    toggleChannelHashColor() {
      if (this.isOpened) {
        if (this.isWatched) {
          return 'white'
        } else {
          return 'var(--primary-color)'
        }
      } else {
        if (this.isWatched) {
          return 'var(--primary-color)'
        } else {
          return 'white'
        }
      }
    },
    channelHashColor() {
      if (this.isWatched) {
        return 'var(--primary-color)'
      }
      return 'white'
    },
    hasInputContent() {
      return this.hasInputText || this.hasInputFiles
    },
    hasInputFiles() {
      return (
        this.$store.getters['messageInput/inputFiles'](this.model.channelId)
          .length > 0
      )
    },
    hasInputText() {
      return (
        this.$store.getters['messageInput/inputText'](this.model.channelId)
          .length > 0
      )
    }
  },
  watch: {
    isOpened: {
      handler() {
        this.$nextTick(() => {
          this.height = this.$refs.childrenContainer.clientHeight
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
  display: inline-block
  align-items: center
  position: relative
  color: $text-light-color
  font-weight: bold
  flex: 1
  padding:
    right: 10px
    left: 2px
  text-align: left
  cursor: pointer
  overflow:
    x: hidden
  white-space: nowrap
  text-overflow: ellipsis
  z-index: 1
  user-select: none
  line-height: 1.6em

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
  display: flex
  position: relative
  padding: 0 0 0 0
  transition: all .2s ease

  &:before
    display: block
    content: ''
    position: absolute
    left: 20px
    width: 1px
    height: 0
    background: $text-light-color
    transition: height .2s ease

  .channel-opened + .channel-children-wrapper>&:before
    height: calc( 100% - 5px )

.channel-children-wrapper
  transition: height .2s ease
  will-change: height

.channel-children-space
  cursor: pointer
  width: 20px
  min-height: 100%
  flex-shrink: 0

  &:hover
    background: rgba(0,0,0,0.1)

.channel-children-container
  flex-grow: 1
  min-width: 0

.channel-before-wrap
  height: 34px
  display: flex
  align-items: center
  padding:
    right: 6px

.channel-before
  position: relative
  display: flex
  justify-content: center
  align-items: center
  width: 20px
  height: 20px
  padding:
    top: 0
    bottom: 1px
  color: $text-light-color
  margin: 0 0 0 10px

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

    .channel-watched &
      background-color: $primary-color
      border-color: white
      opacity: 0.3

    .channel-box:hover &
      border-color: var(--primary-color-hovered)

    .channel-watched.channel-box:hover &
      border-color: white

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

  &.channel-notified:not(.has-unread)::before

    .channel-watched &
      background: white
      opacity: 1

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
  &:hover
    opacity: 0.8

.list-complete-enter-active, .list-complete-leave-active
  transition: all .2s ease
.list-complete-enter, .list-complete-leave-to
  opacity: 0
  transform: translateX(-5px)
</style>
