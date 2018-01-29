<template lang="pug">
div.menu-header
  div.user
    div.user-icon
    div.user-name
      | username
  div.search
    i.fa.fa-search(aria-hidden="true")
</template>

<script>
export default {
}
</script>

<style lang="sass">
.menu-header
  grid-area: user
  display: flex
  // background-color: rgba(15, 88, 144, 0.43)
  border-bottom: solid 1px rgba(255, 255, 255, 0.7)
  margin: 0
.user
  display: flex
  align-items: center
.user-icon
  height: 40px
  width: 40px
  background-color: rgba(255, 255, 255, 0.7)
  border-radius: 100%
  margin: 0 0 0 10px
.user-name
  display: flex
  justify-content: center
  align-items: center
  font-size: 1.2em
  color: white
  word-wrap: break-word
  margin: 0 0 0 10px
.search
  height: 100%
  width: 100%
  height: 100%
  width: 100%
  display: flex
  justify-content: center
  align-items: center
.fa-search
  font-size: 1.5em
  color: white
</style>
