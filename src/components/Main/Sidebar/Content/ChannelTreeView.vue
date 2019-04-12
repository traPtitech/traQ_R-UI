<template lang="pug">
.list-channels
  template(v-if="isUnreadFiltered")
    channel-detail-element(v-for="channel in filteredUnreadChannels" :key="channel.channelId" :model="channel")
    .channel-empty-message(v-if="filteredUnreadChannels.length === 0")
      | 未読はありません
  template(v-else-if="filterText !== ''")
    channel-detail-element(v-for="channel in filteredChannels" :key="channel.channelId" :model="channel")
    .channel-empty-message(v-if="filteredChannels.length === 0")
      | 見つかりませんでした
  template(v-else)
    channel-element(v-for="channel in channels" :key="channel.channelId" :model="channel")
</template>

<script>
import { mapGetters } from 'vuex'
import ChannelElement from '@/components/Main/Sidebar/Content/ChannelElement'
import ChannelDetailElement from './ChannelDetailElement'

export default {
  name: 'ChannelTreeView',
  components: { ChannelElement, ChannelDetailElement },
  computed: {
    ...mapGetters([
      'getChannelUnreadMessageNum',
      'filterText',
      'isUnreadFiltered'
    ]),
    channels() {
      return this.$store.getters.childrenChannels('')
    },
    filteredChannels() {
      return this.allChannels.filter(c => {
        return this.caseIgnoreFilterText.test(c.name)
      })
    },
    filteredUnreadChannels() {
      return this.filteredChannels.filter(
        c => this.getChannelUnreadMessageNum(c.channelId) > 0
      )
    },
    caseIgnoreFilterText() {
      return new RegExp(this.filterText, 'i')
    },
    allChannels() {
      return this.$store.getters.allChannels
    }
  }
}
</script>

<style lang="sass"></style>
