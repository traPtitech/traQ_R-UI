<template lang="pug">
div.sidebar
  User
  Menu
</template>

<script>
import User from '@/components/Main/Sidebar/User'
import Menu from '@/components/Main/Sidebar/Menu'
export default {
  components: {
    'User': User,
    'Menu': Menu
  }
}
</script>

<style lang="sass">
.sidebar
  grid-area: side
  height: 100vh
  background: linear-gradient(95deg,#35769E,#3C5786)
</style>
