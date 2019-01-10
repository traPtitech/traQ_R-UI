<template lang="pug">
  div.stared-channels
    div(v-if="filterText !== ''")
      ChannelElement(v-for="channel in filteredChannels" :key="channel.channelId" :model="channel")
    div(v-else)
      ChannelElement(v-for="channel in channels" :key="channel.channelId" :model="channel")
</template>

<script>
import ChannelElement from '@/components/Main/Sidebar/Content/ChannelElement'
export default {
  props: {
    filterText: {
      type: String,
      default: ''
    }
  },
  computed: {
    channels () {
      return this.$store.getters.getStaredChannels
    },
    filteredChannels () {
      return this.channels
        .filter(c => {
          return this.caseIgnoreFilterText.test(c.name)
        })
    },
    caseIgnoreFilterText () {
      return new RegExp(this.filterText, 'i')
    }
  },
  components: {
    'ChannelElement': ChannelElement
  }
}
</script>

<style lang="sass">
</style>

