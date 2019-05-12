<template lang="pug">
.list-channels
  template(v-if="isUnreadFiltered")
    channel-detail-element(v-for="channel in visibleUnreadChannels" :key="channel.channelId" :model="channel")
    .channel-empty-message(v-if="visibleUnreadChannels.length === 0")
      | 未読はありません
  template(v-else-if="filterText !== ''")
    channel-detail-element(v-for="channel in visibleChannels" :key="channel.channelId" :model="channel")
    .channel-remove-limit(v-if="isSearchLimited" @click="removeSearchLimit")
      | さらに検索する
    .channel-empty-message(v-if="visibleChannels.length === 0")
      | 見つかりませんでした
  template(v-else)
    channel-element(v-for="channel in channels" :key="channel.channelId" :model="channel")
</template>

<script>
import { mapGetters } from 'vuex'
import ChannelElement from '@/components/Main/Sidebar/Content/ChannelElement'
import ChannelDetailElement from './ChannelDetailElement'

const SEARCH_LIMIT = 15

export default {
  name: 'ChannelTreeView',
  data() {
    return {
      isSearchLimited: true
    }
  },
  components: { ChannelElement, ChannelDetailElement },
  methods: {
    removeSearchLimit() {
      this.isSearchLimited = false
    }
  },
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
    visibleChannels() {
      if (this.isSearchLimited) {
        return this.filteredChannels.slice(0, SEARCH_LIMIT + 1)
      }
      return this.filteredChannels
    },
    visibleUnreadChannels() {
      return this.visibleChannels.filter(
        c => this.getChannelUnreadMessageNum(c.channelId) > 0
      )
    },
    caseIgnoreFilterText() {
      return new RegExp(this.filterText, 'i')
    },
    allChannels() {
      return this.$store.getters.allChannels
    }
  },
  watch: {
    filterText() {
      this.isSearchLimited = true
    },
    filteredChannels(val) {
      if (val.length <= SEARCH_LIMIT) {
        this.isSearchLimited = false
      }
    }
  }
}
</script>

<style lang="sass">
.channel-remove-limit
  text-align: center
  padding: 8px
  margin: 8px
  color: white
  background: var(--white-on-primary)
  cursor: pointer
  &:hover
    background: var(--white-on-primary-hovered)
</style>
