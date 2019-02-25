<template lang="pug">
base-common-modal(title="NOTIFICATIONS" small)
  icon-notification-fill(color="var(--primary-color-on-bg)" slot="header-icon" :size="24")
  .channel-notification-modal
    .notifications-item
      h2 ONにしてる人
      .notifications-members(v-if="onMembers.length")
          transition-group(name="slide-fade" tag="ul")
            member-choice(v-for="member in onMembers"
                         @memberSelected="toggleMemberOff(member.userId)"
                         :member="member"
                         :key="member.userId")
      .notifications-empty(v-else)
        IconLandscapeNight(:size="64" color="lightgray")
        | 通知がONの人はいません
    .notifications-item
      h2 OFFにしてる人
      .notifications-members(v-if="offMembers.length")
        transition-group(name="slide-fade" tag="ul")
            member-choice(v-for="member in offMembers"
                         @memberSelected="toggleMemberOn(member.userId)"
                         :member="member"
                         :key="member.userId")
      .notifications-empty(v-else)
        IconLandscapeDay(:size="64" color="lightgray")
        | 通知がOFFの人はいません
</template>

<script>
import { mapState } from 'vuex'
import MessageElement from '@/components/Main/MessageView/MessageElement/MessageElement'
import MemberChoice from '@/components/Main/Modal/Util/MemberChoice'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import IconNotificationFill from '@/components/Icon/IconNotificationFill'
import IconLandscapeDay from '@/components/Icon/IconLandscapeDay'
import IconLandscapeNight from '@/components/Icon/IconLandscapeNight'

export default {
  name: 'ChannelNotificationModal',
  components: {
    MessageElement,
    MemberChoice,
    BaseCommonModal,
    IconNotificationFill,
    IconLandscapeDay,
    IconLandscapeNight
  },
  data () {
    return {
      channelName: '',
      state: 'default'
    }
  },
  computed: {
    ...mapState('modal', ['data']),
    onMembers () {
      return this.$store.getters.notificationsOnMembers.filter(user => !user.bot)
    },
    offMembers () {
      return this.$store.getters.notificationsOffMembers.filter(user => !user.bot)
    }
  },
  methods: {
    toggleMemberOff (userId) {
      this.$store.dispatch('updateCurrentChannelNotifications', { off: [userId] })
    },
    toggleMemberOn (userId) {
      this.$store.dispatch('updateCurrentChannelNotifications', { on: [userId] })
    }
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
    border: 1px solid #eeeeee
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

.slide-fade
  &-enter-active
    transition: all .2s ease

  &-leave-active
    transition: all .1s ease

  &-enter, &-leave-to
    transform: translateX(10px)
    opacity: 0

  &-move
    transition: transform .2s ease
</style>
