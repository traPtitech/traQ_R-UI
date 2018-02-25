<template lang="pug">
div.menu-content
  ChannelList(v-if="$store.state.menuContent=='channels'")
  MemberList(v-if="$store.state.menuContent=='members'")
  LinkList(v-if="$store.state.menuContent=='links'")
</template>

<script>
import ChannelList from '@/components/Main/Sidebar/Content/ChannelList'
import MemberList from '@/components/Main/Sidebar/Content/MemberList'
import LinkList from '@/components/Main/Sidebar/Content/LinkList'
export default {
  data () {
    return {
    }
  },
  components: {
    'ChannelList': ChannelList,
    'MemberList': MemberList,
    'LinkList': LinkList
  }
}
</script>

<style lang="sass">
.menu-content
  grid-area: content
  background-color: #F5F5F5
  border-right: 1px solid rgb(176, 176, 176)
</style>
