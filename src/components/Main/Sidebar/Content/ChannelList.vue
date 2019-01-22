<template lang="pug">
div.channel-list
  div.channel-list-action-area-wrapper
    transition(name="slide" mode="out-in")
      keep-alive
        FilterInput(v-if="channelView === 'tree' || channelView === 'stared'" @inputFilter="filterText = $event")
        ChannelActivityControlls(v-else :isLoading="isLoading" @refreshClick="refresh" @notificationToggleClick="showNotificationEnabled = !showNotificationEnabled")
  transition(name="slide" mode="out-in")
    keep-alive
      ChannelTreeView(v-if="channelView === 'tree'" :filterText="filterText")
      ChannelStared(v-if="channelView === 'stared'" :filterText="filterText")
      ChannelActivity(v-if="channelView === 'activity'" :showNotificationEnabled="showNotificationEnabled")
  div.channel-tab-switcher-wrap.drop-shadow
    div.channel-tab-switcher-item(@click="channelView = 'tree'" :class="{selected: channelView === 'tree'}")
    div.channel-tab-switcher-item(@click="channelView = 'stared'" :class="{selected: channelView === 'stared'}")
    div.channel-tab-switcher-item(@click="channelView = 'activity'" :class="{selected: channelView === 'activity'}")
</template>

<script>
import ChannelTreeView from '@/components/Main/Sidebar/Content/ChannelTreeView'
import ChannelStared from '@/components/Main/Sidebar/Content/ChannelStared'
import ChannelActivity from '@/components/Main/Sidebar/Content/ChannelActivity'
import ChannelActivityControlls from '@/components/Main/Sidebar/Content/ChannelActivityControlls'
import FilterInput from '@/components/Util/FilterInput'

export default {
  name: 'ChannelList',
  data () {
    return {
      channelView: 'tree',
      filterText: '',
      showNotificationEnabled: true,
      isLoading: false
    }
  },
  components: {
    ChannelTreeView,
    ChannelStared,
    ChannelActivity,
    ChannelActivityControlls,
    FilterInput
  },
  methods: {
    async refresh () {
      if (this.isLoading) return
      this.isLoading = true
      await this.$nextTick()
      await Promise.all(this.$store.state.channelData.map(async channel => {
        if (!channel.channelId) return
        await this.$store.dispatch('updateChannelRecentMessage', channel.channelId)
      }))
      this.isLoading = false
    }
  }
}
</script>

<style lang="sass">
.channel-list
  user-select: none
  padding:
    bottom: 40px
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
  animation: fade-in .5s ease
.channel-tab-switcher-item
  display: inline-block
  width: calc( 100% / 3 )
  height: 100%
  cursor: pointer
  background: none
  transition: all .3s ease
  &.selected
    background: $tertiary-color
.channel-list-action-area-wrapper
  width: 80%
  padding:
    top: 20px
  margin: auto
    bottom: 20px
</style>
