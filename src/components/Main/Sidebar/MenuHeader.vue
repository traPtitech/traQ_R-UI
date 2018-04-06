<template lang="pug">
div.menu-header
  div.menu-title.flex-center
    | {{$store.state.menuContent}}
  div.search.flex-center
    i.fa.fa-search(aria-hidden="true")
</template>

<script>
export default {
  name: 'MenuHeader',
  methods: {
  }
}
</script>

<style lang="sass">
.menu-header
  grid-area: header
  display: flex
  justify-content: space-between
  border-right: 1px solid rgb(176, 176, 176)
  border-bottom: 1px solid rgb(176, 176, 176)
  background-color: #F5F5F5
  margin: 0
.menu-title
  font-size: 1.5em
  font-weight: bold
  color: #626262
  flex: 1
  margin: 0 15px
.search
  margin: 0 15px
  height: 100%
.fa-search
  font-size: 1.5em
  color: rgba(0, 0, 0, 0.6)
</style>
