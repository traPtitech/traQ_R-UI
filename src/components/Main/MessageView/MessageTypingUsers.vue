<template lang="pug">
  .message-typing-users
    transition-group.message-typing-users-wrap(name="user-icon-slide-in")
      .message-typing-users-user(v-for="user in typingUsers" :key="user.userId")
        img.message-typing-users-user-icon(:src="getUserIconUrl(user.userId)")
    .message-typing-users-text
      | is typing
</template>

<script>
import client from '@/bin/client'

export default {
  name: 'MessageEditingUsers',
  props: {
    typingUsers: Array
  },
  methods: {
    getUserIconUrl: client.getUserIconUrl
  }
}
</script>

<style lang="sass">
.message-typing-users
  opacity: 0.9
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

.message-typing-users-wrap
  display: flex
  flex-flow: row
  height: 20px

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

.user-icon-slide-in
  &-enter-active, &-leave-active
    transition: all .3s ease
    transform: translateY(0)
  &-enter, &-leave-to
    transform: translateY(10px)
    opacity: 0
  &-leave-active
    position: absolute

</style>
