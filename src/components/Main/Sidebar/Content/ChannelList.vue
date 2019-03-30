<template lang="pug">
.channel-list
  .channel-list-action-area-wrapper
    keep-alive
      .channel-list-filter-wrapper(v-if="channelView === 'tree' || channelView === 'stared'")
        .channel-list-filter-input-wrapper
          filter-input(v-model="filterText" :useDebounce="true")
        .channel-list-toggle-button-wrapper
          toggle-button(v-model="isUnreadFiltered")
            img(src="@/assets/img/icon/unread.svg")
      // channel-activity-controlls(v-else
      //                           :isLoading="isLoading"
      //                           @refreshClick="refresh"
      //                           @filterToggle="toggleNotification")
  keep-alive
    channel-treeView(v-if="channelView === 'tree'" :filterText="filterText" :filterUnread="isUnreadFiltered")
    channel-stared(v-if="channelView === 'stared'" :filterText="filterText" :filterUnread="isUnreadFiltered")
    channel-activity(v-if="channelView === 'activity'")
</template>

<script>
import { mapGetters } from 'vuex'
import ChannelTreeView from '@/components/Main/Sidebar/Content/ChannelTreeView'
import FilterInput from '@/components/Util/FilterInput'
import ToggleButton from '@/components/Util/ToggleButton'

export default {
  name: 'ChannelList',
  data() {
    return {
      filterText: '',
      isUnreadFiltered: false,
      filterSubscribed: true,
      isLoading: false
    }
  },
  components: {
    ChannelTreeView,
    FilterInput,
    ToggleButton,
    ChannelStared: window.asyncLoadComponents(
      import('@/components/Main/Sidebar/Content/ChannelStared')
    ),
    ChannelActivity: window.asyncLoadComponents(
      import('@/components/Main/Sidebar/Content/ChannelActivity')
    ),
    ChannelActivityControlls: window.asyncLoadComponents(
      import('@/components/Main/Sidebar/Content/ChannelActivityControlls')
    )
  },
  methods: {
    async refresh() {
      if (this.isLoading) return
      this.isLoading = true
      await this.$nextTick()
      await this.$store.dispatch('updateChannelActivity')
      this.isLoading = false
    },
    toggleNotification() {
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
    bottom: 60px

.channel-list-action-area-wrapper
  width: 80%
  padding:
    top: 20px
  margin: auto
    bottom: 20px

.channel-list-filter-wrapper
  width: 100%
  display: flex

.channel-list-filter-input-wrapper
  width: calc(100% - 38px)

.channel-list-toggle-button-wrapper
  margin:
    left: 6px

  img
    width: 55%
    margin:
      left: 4px
      bottom: 2px
</style>
