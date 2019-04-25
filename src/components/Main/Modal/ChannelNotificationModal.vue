<template lang="pug">
base-common-modal.channel-notification-modal(title="NOTIFICATIONS" small)
  icon-notification-fill(color="var(--primary-color-on-bg)" slot="header-icon" size="24")
  p 通知を受け取るユーザーを選択
  .notifications-item
    .notifications-members
      member-choice(v-for="notificationItem in membersWithNotificationStatus"
                   @memberSelected="toggleMemberOff(member.userId)"
                   :member="notificationItem.member"
                   :key="notificationItem.member.userId"
                   v-model="notificationItem.status")
  .notifications-modal-footer
    button(@click="$store.emit('closeModal')")
      | キャンセル
    button(@click="submit")
      | 確定
</template>

<script>
import { mapState } from 'vuex'
import MessageElement from '@/components/Main/MessageView/MessageElement/MessageElement'
import MemberChoice from '@/components/Main/Modal/Util/MemberChoice'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import IconNotificationFill from '@/components/Icon/IconNotificationFill'

export default {
  name: 'ChannelNotificationModal',
  components: {
    MessageElement,
    MemberChoice,
    BaseCommonModal,
    IconNotificationFill
  },
  data() {
    return {
      channelName: '',
      state: 'default',
      membersWithNotificationStatus: [],
      initialEnabledMembers: [],
      initialDisabledMembers: []
    }
  },
  computed: {
    ...mapState('modal', ['data'])
  },
  methods: {
    toggleMemberOff(userId) {
      this.$store
        .dispatch('updateCurrentChannelNotifications', { off: [userId] })
        .then(() => {
          if (userId === this.$store.state.me.userId) {
            this.$store.dispatch('updateMyNotifiedChannels')
          }
        })
    },
    toggleMemberOn(userId) {
      this.$store
        .dispatch('updateCurrentChannelNotifications', { on: [userId] })
        .then(() => {
          if (userId === this.$store.state.me.userId) {
            this.$store.dispatch('updateMyNotifiedChannels')
          }
        })
    },
    submit() {
      const toEnableMembers = this.membersWithNotificationStatus.filter(
        ({ member, status }) =>
          status && this.initialDisabledMembers.has(member)
      )
      const toDisableMembers = this.membersWithNotificationStatus.filter(
        ({ member, status }) =>
          !status && this.initialEnabledMembers.has(member)
      )
      this.$store.dispatch('updateCurrentChannelNotifications', {
        on: [...toEnableMembers].map(({ member }) => member.userId),
        off: [...toDisableMembers].map(({ member }) => member.userId)
      })
      this.$store.dispatch('updateMyNotifiedChannels')
      this.$store.dispatch('modal/close')
    }
  },
  mounted() {
    this.initialEnabledMembers = new Set(
      this.$store.getters.notificationsOnMembers.filter(user => !user.bot)
    )
    this.initialDisabledMembers = new Set(
      this.$store.getters.notificationsOffMembers.filter(user => !user.bot)
    )
    const makeMapper = status => member => {
      return { member, status }
    }
    this.membersWithNotificationStatus = [...this.initialEnabledMembers]
      .map(makeMapper(true))
      .concat([...this.initialDisabledMembers].map(makeMapper(false)))
  }
}
</script>

<style lang="sass">
.channel-notification-filter-wrap
  width: 13rem
  margin-left: auto

.notifications-item
  margin: 1rem 0

  h2
    align-self: center
    margin: 0 0 0.5rem 0
    font-size: 1.1rem

  .notifications-members
    height: 25vh
    overflow-y: scroll
    -webkit-overflow-scrolling: touch
    background-color: $background-color

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

.notifications-modal-footer
  display: flex
  justify-content: flex-end
  margin: 0 1rem
</style>
