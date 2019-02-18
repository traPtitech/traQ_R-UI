<template lang="pug">
  div.member-choice(@click="$emit('memberSelected')")
    div.member-choice-icon-container
      img.member-choice-icon(:src="userIconSrc")
    div.member-choice-username.text-ellipsis
      span
        | {{userName}}
</template>

<script>
import client from '@/bin/client'

export default {
  name: 'MemberChoice',
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  computed: {
    userId () {
      return this.member.userId
    },
    userIconSrc () {
      return client.getUserIconUrl(this.userId)
    },
    userName () {
      return this.getUserName(this.userId)
    }
  },
  methods: {
    openUserModal () {
      this.$store.dispatch('openUserModal', this.userId)
    },
    getUserName (userId) {
      const user = this.$store.state.memberMap[userId]
      if (user.bot) return user.displayName + '#bot'
      else return user.displayName
    }
  }
}
</script>

<style lang="sass">
.member-choice
  display: flex
  align-items: center
  cursor: pointer
  padding:
    top: 2px
    left: 4px
    right: 4px
    bottom: 2px

  &:hover
    background: rgba(0,0,0,0.1)

.member-choice-icon-container

.member-choice-icon
  min-width: 30px
  width: 30px
  height: 30px
  border:
    radius: 100%

.member-choice-username
  margin:
    left: 6px

</style>
