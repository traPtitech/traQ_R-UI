<template lang="pug">
  div.activity-channels
    div.activity-channel(v-for="message in messages" :key="message.messageId")
      ChannelActivityElement(:model="message")
</template>

<script>
import ChannelActivityElement from '@/components/Main/Sidebar/Content/ChannelActivityElement'

export default {
  components: {
    ChannelActivityElement
  },
  props: {
  },
  computed: {
    messages () {
      return this.$store.state.filterSubscribedActivity ? this.filteredMessages : this.allMessages
    },
    allMessages () {
      return this.$store.getters.recentMessagesSorted
    },
    filteredMessages () {
      const notifiedChannelIds = this.$store.state.myNotifiedChannels.map(c => c.channelId)
      return this.allMessages.filter(m => notifiedChannelIds.indexOf(m.parentChannelId) > -1)
    }
  }
}
</script>

<style lang="sass">
.activity-channel
  color: white
</style>
