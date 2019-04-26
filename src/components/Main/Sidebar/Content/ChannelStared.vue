<template lang="pug">
.stared-channels
  template(v-if="isUnreadFiltered")
    channel-detail-element(v-for="channel in filteredUnreadChannels" :key="channel.channelId" :model="channel")
    .channel-empty-message(v-if="filteredUnreadChannels.length === 0")
      | 未読はありません
  template(v-else-if="filterText !== ''")
    channel-detail-element(v-for="channel in filteredChannels" :key="channel.channelId" :model="channel")
    .channel-empty-message(v-if="filteredChannels.length === 0")
      | 見つかりませんでした
  template(v-else)
    channel-element(v-for="channel in duplicateCheckedChannels" :key="channel.channelId" :model="channel")
    .channel-empty-message(v-if="duplicateCheckedChannels.length === 0")
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
  computed: {
    ...mapGetters([
      'getChannelUnreadMessageNum',
      'filterText',
      'isUnreadFiltered'
    ]),
    channels() {
      return this.$store.getters.getStaredChannels
    },
    channelNames() {
      return this.channels.map(c => c.name)
    },
    duplicateCheckedChannels() {
      return this.channels.map((c, i) => {
        if (
          this.channelNames.indexOf(c.name) !==
          this.channelNames.lastIndexOf(c.name)
        ) {
          c.isDuplicated = true
        } else {
          c.isDuplicated = false
        }
        return c
      })
    },
    filteredChannels() {
      return this.duplicateCheckedChannels.filter(c => {
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
