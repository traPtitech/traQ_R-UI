<template lang="pug">
div.online-users-box.drop-shadow(v-bind:class="{'is-opened':isOpened}")
  span.online-users-number(@click="isOpened=!isOpened")
    | {{onlineUsersNumber}}
  div.online-users-open-button
  ul.online-users-list(v-bind:style="{height: 50*onlineUsersNumber*(isOpened?1:0) + 'px' }")
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
  z-index: $onlineusers-index
  +mq(pc)
    right: 0
    top: 0
  +mq(sp)
    right: 0
    top: 10px
  background: $third-color
  cursor: pointer
  user-select: none
.online-users-number
  display: flex
  align-items: center
  justify-content: center
  +mq(pc)
    width: 60px
    height: 60px
  +mq(sp)
    width: 60px
    height: 50px
  color: white
  font-size: 20px
  transition: all .3s ease
.online-users-open-button
  position: absolute
  &:before,&:after
    content: ''
    position: absolute
.online-users-list
  display: flex
  align-items: center
  justify-content: center
  transition: all .3s ease
  background: $third-color
  height: 0
  max-height: 80vh
  overflow: scroll
  li
    height: 30px
</style>
