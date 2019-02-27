<template lang="pug">
div.sidebar-content(ref="sidebarContent")
  keep-alive
    component(:is="componentMap[menuContent]")
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
      scrollTopMap: {
        Channels: 0,
        Members: 0,
        Clips: 0,
        Links: 0
      },
      componentMap: {
        'Channels': ChannelList,
        'Members': MemberList,
        'Clips': ClipList,
        'Links': LinkList
      },
      currentTabComponentName: 'Channels'
    }
  },
  computed: {
    menuContent () {
      return this.$store.state.menuContent
    }
  },
  watch: {
    menuContent (newv, oldv) {
      this.$nextTick(() => {
        this.scrollTopMap[oldv] = this.$el.scrollTop
        this.$el.scrollTop = this.scrollTopMap[newv]
      })
    }
  }
}
</script>

<style lang="sass">
.sidebar-content
  height: 100%
  overflow-y: scroll
</style>
