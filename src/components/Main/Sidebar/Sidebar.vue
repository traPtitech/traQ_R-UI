<template lang="pug">
div.sidebar
  MenuHeader
  Navigation
  MenuContent
</template>

<script>
import MenuHeader from '@/components/Main/Sidebar/MenuHeader'
import Navigation from '@/components/Main/Sidebar/Navigation'
import MenuContent from '@/components/Main/Sidebar/MenuContent'
export default {
  components: {
    'MenuHeader': MenuHeader,
    'Navigation': Navigation,
    'MenuContent': MenuContent
  }
}
</script>

<style lang="sass">
.sidebar
  grid-area: side
  display: grid
  grid-template-rows: 60px 1fr
  grid-template-columns: 60px 1fr
  grid-template-areas: "user user" "menu content"
  height: 100vh
  // background: linear-gradient(100deg,#35769E,#3C5786)
  background: linear-gradient(100deg, #3BCCF3, #362490)
  transition: all .5s ease
  @media (max-width: 679px)
    width: 200px
    position: absolute
    z-index: 1000
    left: -200px
</style>
