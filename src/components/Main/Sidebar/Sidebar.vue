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
  grid-template-columns: 50px 1fr
  grid-template-areas: "menu header" "menu content"
  height: 100vh
  background-color: white
  transition: all .5s ease
  @media (max-width: 679px)
    width: 300px
    position: absolute
    z-index: 1000
    left: -300px
</style>
