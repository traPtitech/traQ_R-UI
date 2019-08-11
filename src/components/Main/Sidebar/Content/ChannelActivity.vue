<template lang="pug">
.channel-activity
  .activity-channels
    .activity-channel(v-for="message in messages" :key="message.messageId")
      channel-activity-element(:model="message")
</template>

<script>
import ChannelActivityElement from '@/components/Main/Sidebar/Content/ChannelActivityElement'

export default {
  name: 'ChannelActivity',
  components: {
    ChannelActivityElement
  },
  computed: {
    messages() {
      return this.$store.state.activityMessages.filter(
        message =>
          !!this.$store.state.channelMap[message.parentChannelId] &&
          !this.$store.state.channelMap[message.parentChannelId].dm
      )
    }
  }
}
</script>

<style lang="sass">
.activity-channel
  color: white
</style>
