<template lang="pug">
.channel-list
  .channel-list-action-area-wrapper
      // channel-activity-controlls(v-else
      //                           :isLoading="isLoading"
      //                           @refreshClick="refresh"
      //                           @filterToggle="toggleNotification")
  keep-alive
    channel-treeView(v-if="channelView === 'tree'")
    channel-stared(v-if="channelView === 'stared'")
    channel-activity(v-if="channelView === 'activity'")
</template>

<script>
import { mapGetters } from 'vuex'
import ChannelTreeView from '@/components/Main/Sidebar/Content/ChannelTreeView'

export default {
  name: 'ChannelList',
  data() {
    return {
      filterSubscribed: true,
      isLoading: false
    }
  },
  components: {
    ChannelTreeView,
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
    top: 70px
    bottom: 60px

// .channel-list-action-area-wrapper
//   width: 80%
//   padding:
//     top: 20px
//   margin: auto
//     bottom: 20px

// .channel-list-filter-wrapper
//   width: 100%
//   display: flex

// .channel-list-filter-input-wrapper
//   width: calc(100% - 38px)

// .channel-list-toggle-button-wrapper
//   margin:
//     left: 6px

//   img
//     width: 55%
//     margin:
//       left: 4px
//       bottom: 2px

.channel-empty-message
  display: flex
  justify-content: center
  padding:
    top: 6px
    right: 12px
    left: 12px
  color: $text-light-color
  opacity: 0.5
</style>
