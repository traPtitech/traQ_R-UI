<template lang="pug">
nav.menu-buttons
  ul
    li.menu-button.channels(@click="navClicked('channels')")
      i.fa.fa-hashtag(aria-hidden="true")
    li.menu-button.members(@click="navClicked('members')")
      i.fa.fa-user-circle-o(aria-hidden="true")
    li.menu-button.links(@click="navClicked('links')")
      i.fa.fa-th-large(aria-hidden="true")
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    navClicked: function (n) {
      switch (n) {
        case 'channels':
          this.$store.commit('changeMenuContent','channels')
          break
        case 'members':
          this.$store.commit('changeMenuContent','members')
          break
        case 'links':
          this.$store.commit('changeMenuContent','links')
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
  background-color: #003778
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
</style>
