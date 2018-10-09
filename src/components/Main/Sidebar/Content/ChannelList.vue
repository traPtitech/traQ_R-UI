<template lang="pug">
div.channel-list
  transition(name="slide" mode="out-in")
    keep-alive
      ChannelTreeView(v-if="channelView === 'tree'")
      ChannelStared(v-if="channelView === 'stared'")
      ChannelActivity(v-if="channelView === 'activity'")
  div.channel-tab-switcher-wrap.drop-shadow
    div.channel-tab-switcher-item(@click="channelView = 'tree'" :class="{selected: channelView === 'tree'}")
    div.channel-tab-switcher-item(@click="channelView = 'stared'" :class="{selected: channelView === 'stared'}")
    div.channel-tab-switcher-item(@click="channelView = 'activity'" :class="{selected: channelView === 'activity'}")
</template>

<script>
import ChannelTreeView from '@/components/Main/Sidebar/Content/ChannelTreeView'
import ChannelStared from '@/components/Main/Sidebar/Content/ChannelStared'
import ChannelActivity from '@/components/Main/Sidebar/Content/ChannelActivity'
export default {
  name: 'ChannelList',
  data () {
    return {
      channelView: 'tree'
    }
  },
  components: {
    ChannelTreeView,
    ChannelStared,
    ChannelActivity
  }
}
</script>

<style lang="sass">
.channel-list
  user-select: none
.channel-tab-switcher-wrap
  position: absolute
  bottom: 60px
  width: 120px
  height: 30px
  right: 0
  left: 0
  margin: 0 auto
  background: $secondary-color
  z-index: $sidebar-index + 10
  border-radius: 30px
  overflow: hidden
.channel-tab-switcher-item
  display: inline-block
  width: calc( 100% / 3 )
  height: 100%
  cursor: pointer
  background: none
  transition: all .3s ease
  &.selected
    background: $tertiary-color
</style>
