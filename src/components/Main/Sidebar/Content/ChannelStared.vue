<template lang="pug">
  div.stared-channels
    ChannelElement(v-for="channel in channels" :key="channel.channelId" :model="channel")
</template>

<script>
import ChannelElement from '@/components/Main/Sidebar/Content/ChannelElement'
export default {
  computed: {
    channels () {
      return this.$store.getters.getStaredChannels
    }
  },
  components: {
    'ChannelElement': ChannelElement
  }
}
</script>

<style lang="sass">
</style>

