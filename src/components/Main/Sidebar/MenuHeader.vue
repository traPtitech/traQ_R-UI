<template lang="pug">
div.menu-header
  div.search
    i.fa.fa-search(aria-hidden="true")
  button(@click="logout")
    | logout
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'MenuHeader',
  methods: {
    logout () {
      client.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="sass">
.menu-header
  grid-area: header
  display: flex
  border-right: 1px solid rgb(176, 176, 176)
  border-bottom: 1px solid rgb(176, 176, 176)
  background-color: #F5F5F5
  margin: 0
.search
  height: 100%
  width: 100%
  display: flex
  justify-content: center
  align-items: center
.fa-search
  font-size: 1.5em
  color: rgba(0, 0, 0, 0.6)
</style>
