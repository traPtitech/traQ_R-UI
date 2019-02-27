<template lang="pug">
div.sidebar-content.is-scroll(ref="sidebarContent")
  keep-alive
    component(:is="componentMap[menuContent]")
</template>

<script>
import ChannelList from '@/components/Main/Sidebar/Content/ChannelList'

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
        'Members': window.asyncLoadComponents(import('@/components/Main/Sidebar/Content/MemberList')),
        'Clips': window.asyncLoadComponents(import('@/components/Main/Sidebar/Content/ClipList')),
        'Links': window.asyncLoadComponents(import('@/components/Main/Sidebar/Content/LinkList'))
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
      this.scrollTopMap[oldv] = this.$el.scrollTop
      this.$nextTick(() => {
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
