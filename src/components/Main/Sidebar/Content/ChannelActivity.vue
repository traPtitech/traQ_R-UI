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
  computed: {
    messages () {
      return Object.values(this.$store.state.channelRecentMessageMap).sort((a, b) => {
        if (a.createdAt > b.createdAt) return -1
        if (a.createdAt < b.createdAt) return 1
        else return 0
      })
    }
  }
}
</script>

<style lang="sass">
.activity-channel
  color: white
</style>
