<template lang="pug">
div.menu-content
  ChannelList
  MemberList
  LinkList
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
  background-color: rgba(15, 88, 144, 0.43)
  padding: 5px
</style>
