<template lang="pug">
div.channel-members
  div(@click="showModal")
    icon(name="bell")
  ChannelInformationModal(title="通知設定" @close="closeModal" :active="active")
    div.notifications-item
      div.notifications-fa-wrapper
        icon(name="bell" scale="2")
      h2 ONにしてる人
      div.notifications-members
        div(v-if="toOnMembers.length")
          transition-group(name="slide-fade" tag="ul")
            MemberChoice.member-choice(v-for="member in toOnMembers" @input="toggleMemberOff" :model="member" :key="member.userId")
        div.notifications-empty(v-else)
          icon(name="moon" scale="3")
          div 通知がONの人はいません
    div.notifications-item
      div.notifications-fa-wrapper
        icon(name="bell-slash" scale="2")
      h2 OFFにしてる人
      div.notifications-members
        transition-group(v-if="toOffMembers.length" name="slide-fade" tag="ul")
          MemberChoice.member-choice(v-for="member in toOffMembers" @input="toggleMemberOn" :model="member" :key="member.userId")
        div.notifications-empty(v-else)
          icon(name="sun" scale="3")
          div 通知がOFFの人はいません
</template>

<script>
import client from '@/bin/client'
import ChannelInformationModal from '@/components/Main/MessageView/ChannelInformation/ChannelInformationModal'
import MemberChoice from '@/components/Main/MessageView/ChannelInformation/MemberChoice'
export default {
  name: 'Notifications',
  components: {
    ChannelInformationModal,
    MemberChoice
  },
  data () {
    return {
      active: false,
      state: {},
      toOnMembers: [],
      toOffMembers: []
    }
  },
  methods: {
    showModal () {
      this.$store.dispatch('getCurrentChannelNotifications', this.$store.state.currentChannel.channelId)
      .then(() => {
        this.toOnMembers = this.$store.getters.notificationsOnMembers.filter(user => !user.bot)
        this.toOffMembers = this.$store.getters.notificationsOffMembers.filter(user => !user.bot)
      })
      this.active = true
    },
    closeModal () {
      const state = {
        on: this.toOnMembers.map(member => member.userId),
        off: this.toOffMembers.map(member => member.userId)
      }
      client.changeNotifications(this.$store.state.currentChannel.channelId, state)
      this.toOnMembers = []
      this.toOffMembers = []
      this.active = false
    },
    toggleMemberOff (userId) {
      const index = this.toOnMembers.findIndex(member => member.userId === userId)
      const member = this.toOnMembers[index]
      this.toOnMembers.splice(index, 1)
      this.toOffMembers.push(member)
    },
    toggleMemberOn (userId) {
      const index = this.toOffMembers.findIndex(member => member.userId === userId)
      const member = this.toOffMembers[index]
      this.toOffMembers.splice(index, 1)
      this.toOnMembers.push(member)
    }
  }
}
</script>

<style lang="sass">
.notifications-item
  display: grid
  grid-template-rows: 2rem 1fr
  grid-template-columns: 3.5rem 1fr
  grid-row-gap: 1rem

  &:first-child
    margin-bottom: 1rem

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
    font-size: 1.3rem

  .notifications-members
    grid-row: 2
    @media (min-width: 680px)
      grid-column: 2
    @media (max-width: 679px)
      grid-column: 1 / 3
    height: 25vh
    overflow-y: scroll
    border: 1px solid #eeeeee
    background-color: #ffffff

  .notifications-empty
    height: 100%
    width: 100%
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    color: lightgray
    *
      margin: 0.5rem 0px
    .fa
      height: 5vh
      width: 5vh

.slide-fade
  &-enter-active
    transition: all .2s ease

  &-leave-active
    transition: all .1s ease

  &-enter, &-leave-to
    transform: translateX(10px)
    opacity: 0

  &-move
    transition: transform 1s ease

</style>
