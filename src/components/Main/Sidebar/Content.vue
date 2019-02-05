<template lang="pug">
div.sidebar-content
  transition(name="slide" mode="out-in")
    keep-alive
      ChannelList(v-if="menuContent==='Channels'")
      MemberList(v-if="menuContent==='Members'")
      ClipList(v-if="menuContent==='Clips'")
      LinkList(v-if="menuContent==='Links'")
</template>

<script>
import ChannelList from '@/components/Main/Sidebar/Content/ChannelList'
import MemberList from '@/components/Main/Sidebar/Content/MemberList'
import ClipList from '@/components/Main/Sidebar/Content/ClipList'
import LinkList from '@/components/Main/Sidebar/Content/LinkList'
export default {
  name: 'MenuContent',
  data () {
    return {
    }
  },
  computed: {
    menuContent () {
      return this.$store.state.menuContent
    }
  },
  components: {
    'ChannelList': ChannelList,
    'MemberList': MemberList,
    'ClipList': ClipList,
    'LinkList': LinkList
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
