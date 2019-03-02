<template lang="pug">
  div.member-choice(@click="$emit('memberSelected')")
    div.member-choice-icon-container
      div.member-choice-icon(:style="userIconBackground")
    div.member-choice-username.text-ellipsis
      span
        | {{userName}}
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'MemberChoice',
  props: {
    member: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['fileUrl']),
    userId () {
      return this.member.userId
    },
    userIconBackground () {
      return {
        backgroundImage: `url(${this.fileUrl(this.userDetail.iconFileId)})`
      }
    },
    userDetail () {
      return this.$store.state.memberMap[this.userId]
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
  background:
    size: cover
    position: center center
    repeat: no-repeat

.member-choice-username
  margin:
    left: 6px

</style>
