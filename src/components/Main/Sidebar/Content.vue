<template lang="pug">
div.sidebar-content
  transition(name="slide" mode="out-in")
    keep-alive
      component(:is="currentTabComponentName")
</template>

<script>
import ChannelList from '@/components/Main/Sidebar/Content/ChannelList'
import MemberList from '@/components/Main/Sidebar/Content/MemberList'
import ClipList from '@/components/Main/Sidebar/Content/ClipList'
import LinkList from '@/components/Main/Sidebar/Content/LinkList'

export default {
  name: 'MenuContent',
  computed: {
    menuContent () {
      return this.$store.state.menuContent
    },
    currentTabComponentName () {
      switch (this.menuContent) {
        case 'Channels':
          return 'ChannelList'
        case 'Members':
          return 'MemberList'
        case 'Clips':
          return 'ClipList'
        case 'Links':
          return 'LinkList'
        default:
          return undefined
      }
    }
  },
  components: {
    ChannelList,
    MemberList,
    ClipList,
    LinkList
  }
}
</script>

<style lang="sass">
.sidebar-content
  height: 100%
  overflow:
    y: scroll
.slide-enter-active, .slide-leave-active
  transition: all .1s
  opacity: 1
.slide-enter, .slide-leave-to
  opacity: 0
  transform: translateX(-5px)
</style>
