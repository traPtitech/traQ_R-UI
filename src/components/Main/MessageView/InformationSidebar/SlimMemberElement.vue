<template lang="pug">
  div.slim-member-element(@click="openUserModal")
    div.slim-member-icon-container
      img.slim-member-icon(:src="userIconSrc")
    div.slim-member-element-username.text-ellipsis
      span
        | {{userName}}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SlimMemberElement',
  props: {
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
    userIconSrc() {
      return this.fileUrl(this.$store.state.memberMap[this.userId].iconFileId)
    },
    userName() {
      return this.getUserName(this.userId)
    }
  },
  methods: {
    openUserModal() {
      this.$store.dispatch('openUserModal', this.userId)
    },
    getUserName(userId) {
      const user = this.$store.state.memberMap[userId]
      if (user.bot) return user.displayName + '#bot'
      else return user.displayName
    }
  }
}
</script>

<style lang="sass">
.slim-member-element
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

.slim-member-icon-container

.slim-member-icon
  min-width: 30px
  width: 30px
  height: 30px
  border:
    radius: 100%

.slim-member-element-username
  margin:
    left: 6px
  line-height: 1.4em
</style>
