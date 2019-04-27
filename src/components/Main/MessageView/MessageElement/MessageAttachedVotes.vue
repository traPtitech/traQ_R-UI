<template lang="pug">
  div.message-attached-votes-wrap
    div.attached-vote(v-for="v in mapedVotes")
      div.attached-vote-detail-wrap
        p
          | {{v.title}} 参加者{{v.all}}人
        div.attached-vote-stamp(v-for="(stamp, idx) in v.stamps")
          div.stamp-container(
            :key="stamp.stampId"
            @click="toggleStamp(stamp.id)"
            :title="stamp.title"
            :class="{'stamp-pressed':isContainSelfStamp(stamp.id)}")
            div.stamp(:style="`background-image: url(${fileUrl(stamp.fileId)});`")
          | {{v.raws[idx]}} {{percent(v, stamp.id)}}
</template>

<script>
import { mapGetters } from 'vuex'
import client from '@/bin/client'

export default {
  name: 'MessageAttachedMessages',
  props: {
    votes: {
      type: Array,
      required: true
    },
    stampList: {
      type: Array,
      required: true
    },
    messageId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      renderedBodies: []
    }
  },
  computed: {
    ...mapGetters(['userDisplayName', 'fileUrl']),
    mapedVotes() {
      return this.votes.map(v => {
        return {
          title: v.title,
          all: this.aggregate(v.stamps),
          stamps: v.stamps
            .filter(s => this.$store.state.stampMap[s.id])
            .map(s => this.$store.state.stampMap[s.id]),
          raws: v.stamps
            .filter(s => this.$store.state.stampMap[s.id])
            .map(s => s.raw)
        }
      })
    }
  },
  methods: {
    toggleStamp(stampId) {
      if (this.isContainSelfStamp(stampId)) {
        client.unstampMessage(this.messageId, stampId)
      } else {
        client.stampMessage(this.messageId, stampId)
      }
    },
    isContainSelfStamp(stampId) {
      return this.stampList.find(
        s => s.stampId === stampId && s.userId === this.$store.state.me.userId
      )
    },
    aggregate(stamps) {
      const users = {}
      this.stampList
        .filter(s => stamps.find(stamp => stamp.id === s.stampId))
        .forEach(s => {
          users[s.userId] = true
        })
      return Object.keys(users).length
    },
    sum(stampId) {
      return this.stampList.filter(s => s.stampId === stampId).length
    },
    percent(vote, stampId) {
      if (vote.all === 0) {
        return '-%'
      }
      return `${Math.floor((this.sum(stampId) / vote.all) * 100)}%`
    }
  }
}
</script>

<style lang="sass">
.stamp-pressed
  background: $stamp-active-color
  color: $stamp-pressed-number-color
</style>
