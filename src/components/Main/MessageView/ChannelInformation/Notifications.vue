<template lang="pug">
div.channel-members
  div(@click="showModal")
    div.fas.fa-bell
  ChannelInformationModal(title="通知設定" @close="closeModal" :active="active")
    div.notifications-item
      div.notifications-fa-wrapper
        span.fas.fa-bell
      h2 オンにしてる人
      div.notifications-members
        div(v-for="member in onMembers")
          input(type="checkbox" v-model="state[member.userId]")
          | {{member.name}}
    div.notifications-item
      div.notifications-fa-wrapper
        span.fas.fa-bell-slash
      h2 オフにしてる人
      div.notifications-members
        div(v-for="member in offMembers")
          input(type="checkbox" v-model="state[member.userId]")
          | {{member.name}}
</template>

<script>
import client from '@/bin/client'
import ChannelInformationModal from '@/components/Main/MessageView/ChannelInformation/ChannelInformationModal'
export default {
  name: 'Notifications',
  components: {
    ChannelInformationModal
  },
  data () {
    return {
      active: false,
      state: {}
    }
  },
  methods: {
    showModal () {
      this.active = true
    },
    closeModal () {
      const state = {
        on: [],
        off: []
      }
      Object.keys(this.state).forEach(key => {
        if (this.state[key]) {
          state.on.push(key)
        } else {
          state.off.push(key)
        }
      })
      client.changeNotifications(this.$store.state.currentChannel.channelId, state)
      .then(res => {
        this.$store.commit('setCurrentChannelNotifications', res.data)
      })
      this.active = false
    }
  },
  computed: {
    onMembers () {
      const onMembers = this.$store.getters.notificationsOnMembers
      onMembers.forEach(member => {
        this.state[member.userId] = true
      })
      return onMembers
    },
    offMembers () {
      const offMembers = this.$store.getters.notificationsOffMembers
      offMembers.forEach(member => {
        this.state[member.userId] = false
      })
      return offMembers
    }
  }
}
</script>

<style lang="sass">
.notifications-item
  display: grid
  grid-template-rows: 3.5rem 1fr
  grid-template-columns: 3.5rem 1fr
  .notifications-fa-wrapper
    grid-row: 1
    grid-column: 1
    align-self: center
    font-size: 1.5rem
    color: #464646
  h2
    grid-row: 1
    grid-column: 2
    align-self: center
    margin: 0px
    font-size: 1.5rem
  .notifications-members
    grid-row: 2
    @media (min-width: 680px)
      grid-column: 2
    @media (max-width: 679px)
      grid-column: 1 / 3
    max-height: 14rem
    overflow-y: scroll
    border: 1px solid #eeeeee
    background-color: #ffffff
    div
      margin: 0.5rem 0px 0.5rem 0.5rem
      input
        margin-right: 1rem
</style>
