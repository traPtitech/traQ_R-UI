<template lang="pug">
div.channel-activity-controls-container
  div.channel-activity-button.channel-activity-refresh(@click="refresh")
    IconSync(:class="{rotate: isLoading}")
  div.channel-activity-button.channel-activity-notification-toggle(@click="toggleNotification" :class="notificationToggleClass")
    IconNotificationFill(:color="notificationIconColor")
</template>

<script>
import IconNotificationFill from '@/components/Icon/IconNotificationFill'
import IconSync from '@/components/Icon/IconSync'

export default {
  name: 'ChannelActivityControlls',
  components: {
    IconNotificationFill,
    IconSync
  },
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    notificationToggleClass() {
      return this.$store.state.filterSubscribedActivity ? 'filter-enabled' : ''
    },
    notificationIconColor() {
      return this.$store.state.filterSubscribedActivity
        ? 'var(--primary-color)'
        : 'white'
    }
  },
  methods: {
    refresh() {
      this.$emit('refreshClick')
    },
    toggleNotification() {
      this.$emit('filterToggle')
    }
  }
}
</script>

<style lang="sass">
.channel-activity-controls-container
  display: flex
.channel-activity-button
  max-width: 100%
  height: 1.5rem
  display: flex
  flex-grow: 1
  justify-content: center
  align-items: center
  margin: 0 10px
  padding:
    top: 4px
    right: 20px
    left: 20px
    bottom: 4px
  border-radius: 4px
  background: rgba(255,255,255,0.2)
  color: #FFFFFF
  box-sizing: border-box
.channel-activity-notification-toggle.filter-enabled
  background: rgba(255,255,255, 1)
  .fa-icon
    color: $primary-color
</style>
