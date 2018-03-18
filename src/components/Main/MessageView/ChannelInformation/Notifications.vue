<template lang="pug">
div.channel-members
  div(@click="showModal")
    div.fas.fa-bell
  modal(@close="closeModal" :active="active")
    div
      | オンにしてる人
      div(v-for="member in onMembers")
        input(type="checkbox" v-model="state[member.userId]")
        | {{member.name}}
    div
      | オフにしてる人
      div(v-for="member in offMembers")
        input(type="checkbox" v-model="state[member.userId]")
        | {{member.name}}
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'Notifications',
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
</style>
