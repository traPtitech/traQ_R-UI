<template lang="pug">
div.channel-list
  div.channel-list-action-area-wrapper
    keep-alive
      filter-input(v-if="channelView === 'tree' || channelView === 'stared'" @inputFilter="filterText = $event")
      channel-activity-controlls(v-else
                                :isLoading="isLoading"
                                @refreshClick="refresh"
                                @filterToggle="toggleNotification")
  keep-alive
    channel-treeView(v-if="channelView === 'tree'" :filterText="filterText")
    channel-stared(v-if="channelView === 'stared'" :filterText="filterText")
    channel-activity(v-if="channelView === 'activity'")
</template>

<script>
import {mapGetters} from 'vuex'
import ChannelTreeView from '@/components/Main/Sidebar/Content/ChannelTreeView'
import FilterInput from '@/components/Util/FilterInput'

export default {
  name: 'ChannelList',
  data () {
    return {
      filterText: '',
      filterSubscribed: true,
      isLoading: false
    }
  },
  components: {
    ChannelTreeView,
    FilterInput,
    ChannelStared: window.asyncLoadComponents(import('@/components/Main/Sidebar/Content/ChannelStared')),
    ChannelActivity: window.asyncLoadComponents(import('@/components/Main/Sidebar/Content/ChannelActivity')),
    ChannelActivityControlls: window.asyncLoadComponents(import('@/components/Main/Sidebar/Content/ChannelActivityControlls'))
  },
  methods: {
    async refresh () {
      if (this.isLoading) return
      this.isLoading = true
      await this.$nextTick()
      await this.$store.dispatch('updateChannelActivity')
      this.isLoading = false
    },
    toggleNotification () {
      const filter = this.$store.state.filterSubscribedActivity
      this.$store.dispatch('updateFilterSubscribedActivity', !filter)
      this.refresh()
    }
  },
  computed: {
    ...mapGetters(['channelView'])
  }
}
</script>

<style lang="sass">
.channel-list
  user-select: none
  padding:
    bottom: 40px
    
.channel-list-action-area-wrapper
  width: 80%
  padding:
    top: 20px
  margin: auto
    bottom: 20px
</style>
