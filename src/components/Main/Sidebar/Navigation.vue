<template lang="pug">
nav.menu-buttons
  ul
    li.menu-button.channels(@click="navClicked('channels')")
      i.fa.fa-hashtag(aria-hidden="true")
    li.menu-button.users(@click="navClicked('users')")
      i.fa.fa-user-circle-o(aria-hidden="true")
    li.menu-button.links(@click="navClicked('links')")
      i.fa.fa-th-large(aria-hidden="true")
    li.menu-button.wiki(@click="navClicked('wiki')")
      i.fa.fa-book(aria-hidden="true")
</template>

<script>
export default {
  methods: {
    navClicked: function (n) {
      console.log(n)
      switch (n) {
        case 'channels':
          console.log('hoge')
          break
        case 'users':
          break
        case 'links':
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
.menu-button
  width: 60px
  height: 60px
  display: flex
  cursor: pointer
  align-items: center
  justify-content: center
  color: white
  font-size: 1.6em
  transition: all ease .2s
  &:hover
    color: rgba(255, 255, 255, 0.6)
</style>
