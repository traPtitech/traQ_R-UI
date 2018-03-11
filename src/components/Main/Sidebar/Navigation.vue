<template lang="pug">
nav.menu-buttons
  ul
    li.menu-button.user-icon-wrap
      img.user-icon(:src="`${$store.state.baseURL}/api/1.0/files/${$store.state.memberMap[$store.state.me.userId].iconFileId}`")
    li.menu-button.channels(@click="navClicked('channels')")
      i.fa.fa-hashtag(aria-hidden="true")
    li.menu-button.members(@click="navClicked('members')")
      i.fa.fa-user-circle-o(aria-hidden="true")
    li.menu-button.links(@click="navClicked('links')")
      i.fa.fa-th-large(aria-hidden="true")
</template>

<script>
export default {
  name: 'Navigation',
  data () {
    return {
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
    }
  }
}
</script>

<style lang="sass">
.menu-buttons
  grid-area: menu
  display: flex
  flex-flow: column
  background-color: #3a4891
.menu-button
  display: flex
  margin: 20px auto
  cursor: pointer
  align-items: center
  justify-content: center
  color: white
  font-size: 1.6em
  transition: all ease .2s
  &:hover
    color: rgba(255, 255, 255, 0.6)
.user-icon-wrap
  height: 40px
  margin: 20px auto
  padding: 10px
  border-bottom: solid 1px white
  box-sizing: border-box
.user-icon
  width: 30px
  height: 30px
  border-radius: 100%
  background-color: white
</style>
