<template lang="pug">
base-common-modal.channel-notification-modal(title="NOTIFICATIONS" small)
  icon-notification-fill(color="var(--primary-color-on-bg)" slot="header-icon" size="24")
  p 通知を受け取るユーザーを選択
  filter-input.notification-modal-filter(@input="searchQuery = $event.target.value" is-on-bg)
  .notification-toggle-group-filtering-notice(v-if="isSearchQueryGroup && filterByGroup")
    .notification-toggle-group-icon
      icon-profile-fill(color="var(--primary-color-on-bg)" size="20")
    .notification-toggle-group-info
      p グループ「{{ searchQuery }}」で絞り込んでいます
      a.notification-modal-link ID検索に戻す
  .notifications-item
    .notifications-members
      member-choice(v-for="notificationItem in membersWithNotificationStatus"
                   @memberSelected="toggleMemberOff(member.userId)"
                   :member="notificationItem.member"
                   :key="notificationItem.member.userId"
                   v-model="notificationItem.status")
  .notifications-modal-footer
    .notification-modal-button.notification-modal-button-passive(@click="$store.emit('closeModal')")
      | キャンセル
    .notification-modal-button.notification-modal-button-active(@click="submit")
      | 確定
</template>

<script>
import { mapState } from 'vuex'
import MessageElement from '@/components/Main/MessageView/MessageElement/MessageElement'
import MemberChoice from '@/components/Main/Modal/Util/MemberChoice'
import FilterInput from '@/components/Util/FilterInput'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import IconNotificationFill from '@/components/Icon/IconNotificationFill'
import IconProfileFill from '@/components/Icon/IconProfileFill'

export default {
  name: 'ChannelNotificationModal',
  components: {
    MessageElement,
    MemberChoice,
    FilterInput,
    BaseCommonModal,
    IconNotificationFill,
    IconProfileFill
  },
  data() {
    return {
      searchQuery: '',
      membersWithNotificationStatus: [],
      initialEnabledMembers: [],
      initialDisabledMembers: [],
      filterByGroup: true
    }
  },
  computed: {
    ...mapState('modal', ['data']),
    isSearchQueryGroup() {
      return new Set(this.$store.state.groupData.map(g => g.name)).has(
        this.searchQuery
      )
    }
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
.channel-notification-modal
  padding: 1rem 2rem

.channel-notification-filter-wrap
  width: 13rem
  margin-left: auto

.notification-modal-filter
  margin: 1rem 0
  input.filter-input
    width: 100%

.notification-toggle-group-filtering-notice
  display: flex
  align-items: center

.notification-toggle-group-icon
  margin-right: 1rem

.notification-modal-link
  margin-top: 0.25rem
  color: $link-color
  cursor: pointer

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
  margin: 0 0.5rem

.notification-modal-button
  display: flex
  justify-content: center
  align-items: center
  fot-size: 0.9rem
  width: 6rem
  height: 2.5rem
  user-select: none
  cursor: pointer
  border:
    radius: 4px
    width: 1px
    style: solid

  +mq(sp)
    flex-grow: 1

  &:not(:first-child)
    margin-left: 2rem

  &-active
    color: $primary-color-on-bg
    border-color: $primary-color-on-bg
  &-passive
    color: gray
    border-color: gray
</style>
