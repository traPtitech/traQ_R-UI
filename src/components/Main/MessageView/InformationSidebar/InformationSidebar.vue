<template lang="pug">
div.information-sidebar.drop-shadow(:class="sidebarClass")
  transition(name="information-transition" mode="out-in")
    div.information-sidebar-button(v-if="!isOpened" @click="openSidebar" key="close")
      div.online-users-number
        | {{onlineUsersNumber}}
    div.information-sidebar-content(v-else key="open")
      div.information-sidebar-online-users.separator-line(@click="closeSidebar" :class="{'drop-shadow': isScrolled}")
        div.online-information-container
          span.online-users-number
            | {{onlineUsersNumber}}
          span.online-users-number-text
            | ONLINE
        div.icon-close-wrap
          IconClose
      div.information-sidebar-content-scroller.is-scroll(ref="scroller")
        div.information-sidebar-content-item.separator-line(v-if="isChannel")
          div.information-sidebar-content-header
            IconTopic(:size="24")
            span
              | TOPIC
          div.information-sidebar-content-body
            span(v-if="topic !== ''")
              | {{topic}}
            span.no-topic(v-else)
              | 設定されていません
        div.information-sidebar-content-item.separator-line(v-if="hasPinnedMessage")
          div.information-sidebar-content-header
            IconPin(:size="24")
            span
              | PINNED
          div.information-sidebar-content-body
            template(v-for="p in pinnedMessages")
              SlimMessageElement(:message="p.message")
        div.information-sidebar-content-item
          div(v-for="user in onlineUsers")
            SlimMemberElement(:member="user")
</template>

<script>
import client from '@/bin/client'
import IconClose from '@/components/Icon/IconClose'
import IconTopic from '@/components/Icon/IconTopic'
import IconPin from '@/components/Icon/IconPin'
import SlimMessageElement from '@/components/Main/MessageView/InformationSidebar/SlimMessageElement'
import SlimMemberElement from '@/components/Main/MessageView/InformationSidebar/SlimMemberElement'
import MemberElement from '@/components/Main/Sidebar/Content/MemberElement'

export default {
  name: 'InformationSidebar',
  components: {IconClose, IconTopic, IconPin, SlimMessageElement, SlimMemberElement, MemberElement},
  data () {
    return {
      isOpened: false,
      isNotFirst: false,
      isScrolled: false
    }
  },
  computed: {
    isUserDM () {
      return this.$route.params.user !== undefined
    },
    isChannel () {
      return this.$route.params.channel !== undefined
    },
    onlineUsersNumber () {
      return this.$store.state.heartbeatStatus.userStatuses.length
    },
    onlineUsers () {
      return this.$store.state.heartbeatStatus.userStatuses
    },
    topic () {
      if (this.$route.params.user) return ''
      return this.$store.state.currentChannelTopic.text
    },
    pinnedMessages () {
      return this.$store.state.currentChannelPinnedMessages
        .sort((a, b) => {
          return new Date(a.dateTime) - new Date(b.dateTime)
        })
    },
    hasPinnedMessage () {
      return this.pinnedMessages.length > 0
    },
    sidebarClass () {
      return {
        'is-opened': this.isOpened,
        'is-closed': this.isNotFirst && !this.isOpened
      }
    }
  },
  methods: {
    userIconSrc (userId) {
      return client.getUserIconUrl(userId)
    },
    openSidebar () {
      this.isOpened = true
    },
    closeSidebar () {
      this.isOpened = false
      this.isNotFirst = true
      this.isScrolled = false
    },
    handleScroll () {
      if (this.$refs.scroller.scrollTop > 0) {
        this.isScrolled = true
      } else {
        this.isScrolled = false
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="sass">
.information-sidebar
  position: fixed
  z-index: $information-sidebar-index
  width: $information-sidebar-button-width
  height: 60px
  cursor: pointer
  background: $tertiary-color
  overflow: hidden
  color: $text-light-color

  &.is-closed
    user-select: none
    +mq(pc)
      animation:
        name: close-info-sidebar-pc
    +mq(sp)
      animation:
        name: close-info-sidebar-sp
    animation:
      duration: .4s
      delay: 0s
      timing-function: ease-in
    
  &.is-opened
    cursor: auto
    +mq(pc)
      animation:
        name: open-info-sidebar-pc
    +mq(sp)
      animation:
        name: open-info-sidebar-sp
    animation:
      duration: .6s
      delay: 0s
      timing-function: ease
      fill-mode: forwards
  
  +mq(pc)
    right: 0
    top: 0
    width: $information-sidebar-button-width
    height: 60px
  +mq(sp)
    right: 0
    width: $information-sidebar-button-width
    height: 50px

@keyframes open-info-sidebar-pc
  0%
    width: $information-sidebar-button-width
    height: 60px
  40%
    width: $information-sidebar-width
    height: 60px
  100%
    width: $information-sidebar-width
    height: 100%

@keyframes open-info-sidebar-sp
  0%
    width: $information-sidebar-button-width
    height: 50px
  40%
    width: $information-sidebar-width
    height: 50px
  100%
    width: $information-sidebar-width
    height: 100%

@keyframes close-info-sidebar-pc
  0%
    width: $information-sidebar-width
    height: 100%
  60%
    width: $information-sidebar-width
    height: 60px
  100%
    width: $information-sidebar-button-width
    height: 60px

@keyframes close-info-sidebar-sp
  0%
    width: $information-sidebar-width
    height: 100%
  60%
    width: $information-sidebar-width
    height: 50px
  100%
    width: $information-sidebar-button-width
    height: 50px

.information-sidebar-button

  .online-users-number
    display: flex
    align-items: center
    justify-content: center
    +mq(pc)
      height: 60px
    +mq(sp)
      height: 50px
    color: white
    font-size: 20px

.information-sidebar-content

.information-sidebar-content-scroller
  overflow-y: scroll
  +mq(pc)
    height: calc(100vh - 60px)
  +mq(sp)
    height: calc(100vh - 50px)

.information-sidebar-content-item
  margin:
    top: 12px
  padding:
    bottom: 12px
    left: 12px
    right: 12px

.information-sidebar-content-header
  display: flex
  align-items: center

  span
    font-weight: bold
    margin:
      left: 6px

.information-sidebar-content-body
  margin:
    top: 6px

  .no-topic
    opacity: 0.5

.information-sidebar-online-users
  display: flex
  align-items: center
  transition: all .5s
  cursor: pointer
  +mq(pc)
    height: 60px
  +mq(sp)
    height: 50px

  .online-users-number
    font-size: 24px

  .online-users-number-text
    font-weight: bold
    font-size: 18px
    padding:
      left: 6px

  .icon-close-wrap
    display: flex
    align-items: center
    height: 100%
    padding:
      left: 12px
      right: 12px
    margin:
      left: auto
    // cursor: pointer 

.online-information-container
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  padding:
    left: 12px

.information-transition-enter-active, .information-transition-leave-active
  transition: all .4s
  opacity: 1
.information-transition-enter, .information-transition-leave-to
  opacity: 0
  transform: translateX(-5px)

.separator-line
  position: relative
  
  &:before
    content: ''
    position: absolute
    margin: auto
    left: 0
    right: 0
    bottom: 0
    display: block
    width: calc(100% - 12px*2)
    height: 1px
    opacity: 0.5
    background: $light-bg-color

</style>

