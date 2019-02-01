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
    filterChannels: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    messages () {
      return this.$store.getters.recentMessagesArray
    }
  }
}
</script>

<style lang="sass">
.activity-channel
  color: white
</style>
