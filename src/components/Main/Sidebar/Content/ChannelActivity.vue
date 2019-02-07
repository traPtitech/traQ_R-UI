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
      return this.$store.state.channelRecentMessages
        .filter(message => !!this.$store.state.channelMap[message.parentChannelId] &&
                           !this.$store.state.channelMap[message.parentChannelId].dm)
    }
  }
}
</script>

<style lang="sass">
.activity-channel
  color: white
</style>
