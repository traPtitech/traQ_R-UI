<template lang="pug">
div.menu-content
  ChannelList(v-show="$store.state.menuContent=='Channels'")
  MemberList(v-show="$store.state.menuContent=='Members'")
  ClipList(v-show="$store.state.menuContent=='Clips'")
  LinkList(v-show="$store.state.menuContent=='Links'")
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
</style>
