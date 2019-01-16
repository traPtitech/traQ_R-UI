<template lang="pug">
div.online-users-box(v-bind:class="{'is-opened':isOpened}")
  div.online-users-number(@click="isOpened=!isOpened")
    | {{onlineUsersNumber}}
  div.online-users-open-button
  ul.online-users-list(v-if="onlineUsers" @mouseleave="removeCurrentUser")
    li(v-for="(user,i) in onlineUsers" @mouseover="setCurrentUser(i)")
      img.user-icon(:src="userIconSrc(user)")
  div.online-users-info.drop-shadow(v-if="currentUserIndex!==null && isOpened" :style="{top: 50*currentUserIndex+65+'px'}")
    span.text-ellipsis
      | {{$store.state.memberMap[onlineUsers[currentUserIndex].userId].displayName}}
      //- | {{$store.state.memberMap[currentUserId].displayName}}
</template>

<script>
import client from '@/bin/client'
export default {
  data () {
    return {
      isOpened: false,
      currentUserIndex: null
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
    },
    setCurrentUser (userIndex) {
      this.currentUserIndex = userIndex
    },
    removeCurrentUser () {
      this.currentUserIndex = null
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
  transition: all .3s
  box-shadow: 0 0 0
  &:not(.is-opened)
    box-shadow: 0 2px 4px rgba(41, 41, 41, 0.5)
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
  background: $tertiary-color
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
  background: $tertiary-color
  max-height: 80vh
  overflow:
    x: hidden
    y: auto
  position: relative
  transform: translateY(-100%)
  +mq(pc)
    padding: 70px 0 10px
    top: -60px
  +mq(sp)
    padding: 60px 0 10px
    top: -50px
  .is-opened &
    transform: translateY(0)
    box-shadow: 0 2px 4px rgba(41, 41, 41, 0.5)
  li
    margin: 10px 0
    height: 30px
.online-users-info
  display: flex
  align-items: center
  position: absolute
  padding: 0 0 0 10px
  box-sizing: border-box
  top: 60px
  right: $online-users-box-width + 10px
  width: 150px
  height: 40px
  background: $tertiary-color
  color: $text-light-color
  transition: all .3s ease
  span
    width: 100%
</style>
