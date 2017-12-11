<template lang="pug">
div.titlebar
  p.channel-name #general
  div.buttons
    div.star
    div.search
</template>

<script>
export default {
}
</script>

<style lang="sass">
.titlebar
  display: flex
  align-items: center
  justify-content: space-between
  grid-area: titlebar
  background-color: rgb(228, 228, 228)
  border-bottom: 2px solid rgb(176, 176, 176)
.channel-name
  color: rgba(0, 0, 0, 0.6)
  font-size: 2.5em
  font-weight: bold
  text-align: left
  margin: 0 0 0 10px
.buttons
  display: flex
  flex-flow: row
  div
    width: 50px
    height: 50px
    background-color: gray
    margin: 10px
</style>
