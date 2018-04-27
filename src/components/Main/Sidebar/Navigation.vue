<template lang="pug">
nav.menu-buttons
  ul
    li.user-icon-wrap
      img.user-icon(:src="`${$store.state.baseURL}/api/1.0/files/${$store.state.memberMap[$store.state.me.userId].iconFileId}`" @click="userMenuOpened=!userMenuOpened")
      div.user-logout(v-show="userMenuOpened" @click="logout")
        p.flex-center
          | ログアウト
    li.menu-button.channels(@click="navClicked('channels')" :class="{'menu-active':menuContent==='channels'}")
      icon(name="hashtag")
      p(v-if="menuContent !== 'channels' && channelsUnreadNum > 0")
        | {{channelsUnreadNum}}
    li.menu-button.members(@click="navClicked('members')" :class="{'menu-active':menuContent==='members'}")
      icon(name="user")
      p(v-if="menuContent !== 'members' && usersUnreadNum > 0")
        | {{usersUnreadNum}}
    li.menu-button.clips(@click="navClicked('clips')" :class="{'menu-active':menuContent==='clips'}")
      icon(name="paperclip")
    li.menu-button.links(@click="navClicked('links')" :class="{'menu-active':menuContent==='links'}")
      icon(name="th-large")
    li.menu-button.setting(@click="$router.push('/setting')")
      icon(name="cog")
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'Navigation',
  data () {
    return {
      userMenuOpened: false,
      menuContent: 'channels'
    }
  },
  methods: {
    navClicked: function (n) {
      switch (n) {
        case 'channels':
          this.$store.commit('changeMenuContent', 'Channels')
          this.menuContent = 'channels'
          break
        case 'members':
          this.$store.commit('changeMenuContent', 'Members')
          this.menuContent = 'members'
          break
        case 'clips':
          this.$store.commit('changeMenuContent', 'Clips')
          this.menuContent = 'clips'
          break
        case 'links':
          this.$store.commit('changeMenuContent', 'Links')
          this.menuContent = 'links'
          break
        case 'wiki':
          this.menuContent = 'wiki'
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
  },
  computed: {
    channelsUnreadNum () {
      return this.$store.getters.getChannelUnreadMessageSum('')
    },
    usersUnreadNum () {
      return this.$store.getters.getUnreadDirectMessagesSum
    }
  }
}
</script>

<style lang="sass">
@import "~@/styles/global.sass"
.menu-buttons
  grid-area: menu
  user-select: none
  background-color: $primary-color
  ul
    height: 100%
    display: flex
    flex-flow: column
    align-items: flex-end
.menu-button
  display: flex
  position: relative
  width: 100%
  padding: 10px 0
  cursor: pointer
  align-items: center
  justify-content: center
  color: white
  font-size: 1.3em
  transition: all .2s ease
  &:hover
    color: rgba(255, 255, 255, 0.6)
  &:after
    position: absolute
    display: block
    content: ''
    top: 0
    right: 0
    width: 0
    height: 100%
    background: white
    transition: width .2s ease
  &.menu-active
    &:after
      width: 8%
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
  margin-top: 10px
.setting
  margin-top: auto
  margin-bottom: 20px
</style>
