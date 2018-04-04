<template lang="pug">
nav.menu-buttons
  ul
    li.user-icon-wrap
      img.user-icon(:src="`${$store.state.baseURL}/api/1.0/files/${$store.state.memberMap[$store.state.me.userId].iconFileId}`" @click="userMenuOpened=!userMenuOpened")
      div.user-logout(v-show="userMenuOpened" @click="logout")
        p.flex-center
          | ログアウト
    li.menu-button.channels(@click="navClicked('channels')")
      i.fas.fa-hashtag(aria-hidden="true")
    li.menu-button.members(@click="navClicked('members')")
      i.fas.fa-user(aria-hidden="true")
    li.menu-button.links(@click="navClicked('links')")
      i.fas.fa-th-large(aria-hidden="true")
    li.menu-button.setting(@click="$router.push('/setting')")
      i.fas.fa-cog(aria-hidden="true")
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'Navigation',
  data () {
    return {
      userMenuOpened: false
    }
  },
  methods: {
    navClicked: function (n) {
      switch (n) {
        case 'channels':
          this.$store.commit('changeMenuContent', 'channels')
          break
        case 'members':
          this.$store.commit('changeMenuContent', 'members')
          break
        case 'links':
          this.$store.commit('changeMenuContent', 'links')
          break
        case 'wiki':
          break
        default:
      }
    },
    logout () {
      client.logout()
        .then(() => {
          location.href = '/login'
        })
    }
  }
}
</script>

<style lang="sass">
.menu-buttons
  grid-area: menu
  background-color: #3a4891
  ul
    height: 100%
    display: flex
    flex-flow: column
    align-items: flex-end
.menu-button
  display: flex
  margin: 15px auto 0
  cursor: pointer
  align-items: center
  justify-content: center
  color: white
  font-size: 1.6em
  transition: all ease .2s
  &:hover
    color: rgba(255, 255, 255, 0.6)
.user-icon-wrap
  display: flex
  justify-content: center
  align-items: center
  height: 60px
  margin: 0 auto
  box-sizing: border-box
  position: relative
  &::after
    position: absolute
    content: ''
    display: block
    bottom: 0
    width: 60%
    height: 1px
    background-color: white
    opacity: 0.8
.user-icon
  position: relative
  width: 30px
  height: 30px
  border-radius: 100%
  background-color: white
  .menu-buttons &
    border: solid 2px white
    transition: border-color .5s ease
    cursor: pointer
    &:hover
      border-color: #30d2ff
.user-logout
  position: absolute
  background-color: #4e72d6
  top: 50%
  left: 130%
  transform: translateY(-50%)
  width: 6em
  height: 30px
  cursor: pointer
  color: white
  & p
    width: 100%
    height: 100%
    transition: all .5s ease
  &:hover p
    background-color: rgba(255, 255, 255, 0.3)
.channels
.setting
  margin-top: auto
  margin-bottom: 20px
</style>
