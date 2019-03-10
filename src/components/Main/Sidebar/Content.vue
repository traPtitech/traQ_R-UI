<template lang="pug">
div.sidebar-content.is-scroll(ref="sidebarContent")
  keep-alive
    component(:is="componentMap[menuContent]")
</template>

<script>
import { mapGetters } from 'vuex'
import ChannelList from '@/components/Main/Sidebar/Content/ChannelList'

export default {
  name: 'MenuContent',
  data() {
    return {
      scrollTopMap: {
        Channels: {
          tree: 0,
          stared: 0,
          activity: 0
        },
        Members: 0,
        Clips: 0,
        Links: 0
      },
      componentMap: {
        Channels: ChannelList,
        Members: window.asyncLoadComponents(
          import('@/components/Main/Sidebar/Content/MemberList')
        ),
        Clips: window.asyncLoadComponents(
          import('@/components/Main/Sidebar/Content/ClipList')
        ),
        Links: window.asyncLoadComponents(
          import('@/components/Main/Sidebar/Content/LinkList')
        )
      },
      currentTabComponentName: 'Channels'
    }
  },
  computed: {
    ...mapGetters(['channelView']),
    menuContent() {
      return this.$store.state.menuContent
    }
  },
  watch: {
    menuContent(newv, oldv) {
      if (oldv === 'Channels') {
        this.scrollTopMap[oldv][this.channelView] = this.$el.scrollTop
      } else {
        this.scrollTopMap[oldv] = this.$el.scrollTop
      }
      this.$nextTick(() => {
        if (newv === 'Channels') {
          this.$el.scrollTop = this.scrollTopMap[newv][this.channelView]
        } else {
          this.$el.scrollTop = this.scrollTopMap[newv]
        }
      })
    },
    channelView(newv, oldv) {
      this.scrollTopMap[this.menuContent][oldv] = this.$el.scrollTop
      this.$nextTick(() => {
        this.$el.scrollTop = this.scrollTopMap[this.menuContent][newv]
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
