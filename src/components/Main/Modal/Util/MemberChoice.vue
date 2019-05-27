<template lang="pug">
.member-choice(@click="handleClick", :style="memberChoiceStyle")
  .member-choice-user-container
    .member-choice-icon-container
      .member-choice-icon(:style="userIconBackground")
    .member-choice-username.text-ellipsis
      span
        | {{userName}}
  icon-notification-fill(v-if="value" size="22" color="var(--primary-color-on-bg)")
  icon-notification(v-else size="22" color="var(--primary-color-on-bg)")
</template>

<script>
import { mapGetters } from 'vuex'
import IconNotification from '@/components/Icon/IconNotification'
import IconNotificationFill from '@/components/Icon/IconNotificationFill'

export default {
  name: 'MemberChoice',
  components: {
    IconNotification,
    IconNotificationFill
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    member: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['fileUrl']),
    userId() {
      return this.member.userId
    },
    userIconBackground() {
      return {
        backgroundImage: `url(${this.fileUrl(this.userDetail.iconFileId)})`
      }
    },
    userDetail() {
      return this.$store.state.memberMap[this.userId]
    },
    userName() {
      return this.getUserName(this.userId)
    },
    memberChoiceStyle() {
      return { opacity: this.value ? 1 : 0.5 }
    }
  },
  methods: {
    openUserModal() {
      this.$store.dispatch('modal/openUserModal', this.userId)
    },
    getUserName(userId) {
      const user = this.$store.state.memberMap[userId]
      if (user.bot) return user.displayName + '#bot'
      else return user.displayName
    },
    handleClick() {
      this.$emit('input', !this.value)
    }
  }
}
</script>

<style lang="sass">
.member-choice
  display: flex
  align-items: center
  justify-content: space-between
  cursor: pointer
  padding: 0.5rem 1rem

  &:hover
    background: rgba(0,0,0,0.1)

.member-choice-user-container
  display: flex
  align-items: center
  overflow: hidden

.member-choice-icon
  min-width: 30px
  width: 30px
  height: 30px
  border:
    radius: 100%
  background:
    size: cover
    position: center center
    repeat: no-repeat

.member-choice-username
  margin:
    left: 6px
</style>
