<template lang="pug">
div.channel-activity-controls-container
  div.channel-activity-button.channel-activity-refresh(
    :class="{ 'drop-shadow': hasDropShadow }"
    @click="refresh"
  )
    IconSync(:color="syncIconColor" :class="{rotate: isLoading}" size="18")
  div.channel-activity-button.channel-activity-notification-toggle(
    @click="toggleNotification"
    :class="notificationToggleClass"
  )
    IconNotificationFill(:color="notificationIconColor" size="18")
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
  data() {
    return {
      isLoading: false
    }
  },
  props: {
    hasDropShadow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    notificationToggleClass() {
      return {
        'filter-enabled': this.$store.state.filterSubscribedActivity,
        'drop-shadow': this.hasDropShadow
      }
    },
    notificationIconColor() {
      return this.$store.state.filterSubscribedActivity
        ? 'var(--white-on-primary)'
        : 'white'
    },
    syncIconColor() {
      return this.isLoading ? 'rgba(255, 255, 255, 0.5)' : 'white'
    }
  },
  methods: {
    async refresh() {
      if (this.isLoading) return
      this.isLoading = true
      await this.$nextTick()
      await Promise.all([
        this.$store.dispatch('updateChannelActivity'),
        new Promise(resolve => setTimeout(() => resolve(), 500))
      ])
      this.isLoading = false
    },
    toggleNotification() {
      const filter = this.$store.state.filterSubscribedActivity
      this.$store.dispatch('updateFilterSubscribedActivity', !filter)
      this.refresh()
    }
  }
}
</script>

<style lang="sass">
.channel-activity-controls-container
  display: flex
  width: 100%
.channel-activity-button
  max-width: 100%
  height: 30px
  flex-grow: 1
  display: flex
  justify-content: center
  align-items: center
  border-radius: 4px
  background: var(--white-on-primary)
  color: #FFFFFF
  box-sizing: border-box
  &:first-child
    margin-right: 12px
.channel-activity-notification-toggle.filter-enabled
  background: white
  .fa-icon
    color: $primary-color
</style>
