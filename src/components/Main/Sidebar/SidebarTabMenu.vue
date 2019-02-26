<template lang="pug">
nav.sidebar-tab-menu
  ul
    li.sidebar-menu-button.flex-center.channels(
      @click="navClicked('Channels')" 
      :class="{'menu-active':menuContent==='Channels'}")
      icon-hash(:size="20")
      .sidebar-tab-menu-unread-indicator(v-if="channelsUnreadNum > 0")
    li.sidebar-menu-button.flex-center.members(
      @click="navClicked('Members')" 
      :class="{'menu-active':menuContent==='Members'}")
      icon-profile-fill(:size="20")
      .sidebar-tab-menu-unread-indicator(v-if="usersUnreadNum > 0")
    li.sidebar-menu-button.flex-center.clips(
      @click="navClicked('Clips')" 
      :class="{'menu-active':menuContent==='Clips'}")
      icon-attach(:size="20")
    li.sidebar-menu-button.flex-center.links(
      @click="navClicked('Links')" 
      :class="{'menu-active':menuContent==='Links'}")
      icon-tool-box(:size="20")
</template>

<script>
import client from '@/bin/client'
import IconHash from '@/components/Icon/IconHash'
import IconProfileFill from '@/components/Icon/IconProfileFill'
import IconAttach from '@/components/Icon/IconAttach'
import IconToolBox from '@/components/Icon/IconToolBox'

export default {
  name: 'SidebarTabMenu',
  components: {
    IconHash,
    IconProfileFill,
    IconAttach,
    IconToolBox
  },
  data () {
    return {
      userMenuOpened: false
    }
  },
  methods: {
    navClicked: function (n) {
      switch (n) {
        case 'Channels':
          this.$store.commit('changeMenuContent', 'Channels')
          break
        case 'Members':
          this.$store.commit('changeMenuContent', 'Members')
          break
        case 'Clips':
          this.$store.commit('changeMenuContent', 'Clips')
          break
        case 'Links':
          this.$store.commit('changeMenuContent', 'Links')
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
    menuContent () {
      return this.$store.state.menuContent
    },
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
.sidebar-tab-menu
  user-select: none
  background-color: $secondary-color
  ul
    height: $navigation-height
    display: flex
    align-items: flex-end
.sidebar-menu-button
  position: relative
  width: 100%
  height: 100%
  cursor: pointer
  color: rgba(255, 255, 255, 0.6)
  font-size: 1.3em
  &:hover
    color: white
  &.menu-active
    background: $primary-color
    color: white
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
  .sidebar-menu-buttons &
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
  &:hover p
    background-color: rgba(255, 255, 255, 0.3)

.sidebar-tab-menu-unread-indicator
  position: absolute
  display: block
  width: 7px
  height: 7px
  right: 17px
  top: 15px
  border-radius: 100%
  background: $notification-color

</style>
