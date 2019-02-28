<template lang="pug">
  .message-typing-users(v-if="isAnyoneTyping")
    .message-typing-users-user(v-for="user in typingUsers")
      img.message-typing-users-user-icon(:src="getUserIconUrl(user.userId)")
    .message-typing-users-text
      | is typing
</template>

<script>
import client from '@/bin/client'

export default {
  name: 'MessageEditingUsers',
  computed: {
    me () {
      return this.$store.state.me
    },
    typingUsers () {
      return this.$store.state.heartbeatStatus.userStatuses
        .filter(user => user.userId !== this.me.userId)
        .filter(user => user.status === 'editing')
    },
    isAnyoneTyping () {
      return this.typingUsers.length > 0
    }
  },
  methods: {
    getUserIconUrl: client.getUserIconUrl
  }
}
</script>

<style lang="sass">
.message-typing-users
  position: absolute
  width: 100%
  transform: translateY(-100%)
  display: flex
  flex-flow: row
  flex-wrap: wrap
  align-items: center
  background-color: var(--background-color)
  z-index: 1
  padding:
    top: 5px
    left: 10px
    bottom: 5px

.message-typing-users-text
  font:
    size: 12px
    weight: bold
  color: var(--text-color)
  opacity: 0.8

.message-typing-users-user
  margin:
    right: 5px

.message-typing-users-user-icon
  min-width: 20px
  width: 20px
  height: 20px
  border:
    radius: 100%

</style>
