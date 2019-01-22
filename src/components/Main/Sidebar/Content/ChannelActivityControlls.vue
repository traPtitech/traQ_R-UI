<template lang="pug">
div.channel-activity-controls-container
  div.channel-activity-button.channel-activity-refresh(@click="refresh")
    icon(v-if="isLoading" name="redo-alt" scale="0.8" spin)
    icon(v-else name="redo-alt" scale="0.8")
  div.channel-activity-button.channel-activity-notification-toggle(@click="toggleNotification")
    icon(name="bell" scale="0.8")
</template>

<script>
export default {
  name: 'ChannelActivityControlls',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    refresh () {
      this.$emit('refreshClick')
    },
    toggleNotification () {
      this.$emit('toggleNotificationClick')
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
</style>

