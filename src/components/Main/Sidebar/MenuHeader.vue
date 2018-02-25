<template lang="pug">
div.menu-header
  div.user
    div.user-icon
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
  border-right: 1px solid rgb(176, 176, 176)
  border-bottom: 1px solid rgb(176, 176, 176)
  background-color: #F5F5F5
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
  color: rgba(0, 0, 0, 0.6)
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
  color: rgba(0, 0, 0, 0.6)
</style>
