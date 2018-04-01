<template lang="pug">
div.channel-online-users(v-on:click="isOpened=!isOpened;clicked" v-on:blur="isOpened = false" v-bind:class="{ 'opened' : isOpened }")
    | {{onlineUsersNumber}}
    ul.channel-online-users-list(v-show="isOpened")
      li.channel-online-users-item(v-for="user in onlineUsers")
        img.user-icon(:src="userIconSrc(user)")
        p
          | {{$store.state.memberMap[user.userId].displayName}}
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'OnlineUsers',
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
    }
  }
}
</script>

<style lang="sass">
.channel-online-users
  position: relative
  color: white
  width: 80%
  text-align: center
  margin: 10px auto 5px
  padding: 2px 0
  background: #4e73d6
  border-radius: 5px
  user-select: none
  cursor: pointer
  transition: background-color .5s ease
  &.opened
    background-color: #3a4890
.channel-online-users-list
  position: absolute
  right: calc( 100% + 10px )
  top: 0
  min-width: 200px
  background: #4e72d6
  padding: 5px 0
  border-radius: 3px
.channel-online-users-item
  display: flex
  align-items: center
  padding: 5px 10px
  &:hover
    background-color: rgba(255,255,255,0.3)
</style>
