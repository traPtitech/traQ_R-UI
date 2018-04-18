<template lang="pug">
div.menu-content
  transition(name="slide" mode="out-in")
    keep-alive
      ChannelList(v-if="$store.state.menuContent=='Channels'")
      MemberList(v-if="$store.state.menuContent=='Members'")
      ClipList(v-if="$store.state.menuContent=='Clips'")
      LinkList(v-if="$store.state.menuContent=='Links'")
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
  components: {
    'ChannelList': ChannelList,
    'MemberList': MemberList,
    'ClipList': ClipList,
    'LinkList': LinkList
  }
}
</script>

<style lang="sass">
.menu-content
  grid-area: content
  background-color: #F5F5F5
  border-right: 1px solid rgb(176, 176, 176)
  overflow: scroll
  -webkit-overflow-scrolling: touch
.slide-enter-active, .slide-leave-active
  transition: all .1s
  opacity: 1
.slide-enter, .slide-leave-to
  opacity: 0
  transform: translate(-5px)
</style>
