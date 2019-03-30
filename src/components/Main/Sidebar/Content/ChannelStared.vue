<template lang="pug">
.stared-channels
  template(v-if="filterUnread")
    channel-detail-element(v-for="channel in filteredUnreadChannels" :key="channel.channelId" :model="channel")
    .channel-empty-message(v-if="filteredUnreadChannels.length === 0")
      | 未読はありません
  template(v-else-if="filterText !== ''")
    channel-detail-element(v-for="channel in filteredChannels" :key="channel.channelId" :model="channel")
    .channel-empty-message(v-if="filteredChannels.length === 0")
      | 見つかりませんでした
  template(v-else)
    channel-element(v-for="channel in channels" :key="channel.channelId" :model="channel")
    .channel-empty-message(v-if="channels.length === 0")
      | お気に入りのチャンネルがまだないようです
</template>

<script>
import { mapGetters } from 'vuex'
import ChannelElement from '@/components/Main/Sidebar/Content/ChannelElement'
import ChannelDetailElement from './ChannelDetailElement'

export default {
  name: 'ChannelStared',
  components: {
    ChannelElement,
    ChannelDetailElement
  },
  props: {
    filterText: {
      type: String,
      default: ''
    },
    filterUnread: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['getChannelUnreadMessageNum']),
    channels() {
      return this.$store.getters.getStaredChannels
    },
    filteredChannels() {
      return this.channels.filter(c => {
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
    }
  }
}
</script>

<style lang="sass"></style>
