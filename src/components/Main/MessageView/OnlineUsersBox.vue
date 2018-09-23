<template lang="pug">
div.online-users-box.drop-shadow(v-bind:class="{'is-opened':isOpened}")
  span.online-users-number(@click="isOpened=!isOpened")
    | {{onlineUsersNumber}}
  div.online-users-open-button
  ul.online-users-list(v-if="onlineUsers")
    li(v-for="user in onlineUsers")
      img.user-icon(:src="userIconSrc(user)")
      // p
      //   | {{$store.state.memberMap[user.userId].displayName}}
</template>

<script>
import client from '@/bin/client'
export default {
  data () {
    return {
      isOpened: false
    }
  },
  computed: {
    onlineUsersNumber () {
      return this.$store.state.heartbeatStatus.userStatuses.length
    },
    onlineUsers () {
      return this.$store.state.heartbeatStatus.userStatuses
    }
  },
  methods: {
    userIconSrc (user) {
      return client.getUserIconUrl(user.userId)
    },
    clicked (el) {
      el.focus()
    },
    openUserModal (userId) {
      this.$store.dispatch('openUserModal', userId)
    }
  }
}
</script>

<style lang="sass">
.online-users-box
  position: fixed
  z-index: $online-users-box-index
  +mq(pc)
    right: 0
    top: 0
    width: $online-users-box-width
    height: 60px
  +mq(sp)
    right: 0
    // top: 10px
    width: $online-users-box-width
    height: 50px
  cursor: pointer
  user-select: none
.online-users-number
  display: flex
  align-items: center
  justify-content: center
  +mq(pc)
    height: 60px
  +mq(sp)
    height: 50px
  color: white
  font-size: 20px
  transition: all .3s ease
  background: $third-color
  &::before
    content: ''
    position: absolute
    bottom: 0
    display: block
    margin: auto
    width: 0
    height: 1px
    background: $border-color
    transition: width .5s ease
    .is-opened &
      width: 80%
.online-users-open-button
  position: absolute
  &:before,&:after
    content: ''
    position: absolute
.online-users-list
  display: flex
  z-index: -1
  flex-flow: column
  align-items: center
  justify-content: center
  transition: all .5s ease
  background: $third-color
  max-height: 80vh
  padding: 10px 0
  overflow: scroll
  position: relative
  transform: translateY(-100%)
  .is-opened &
    transform: translateY(0)
  li
    margin: 10px 0
    height: 30px
</style>
