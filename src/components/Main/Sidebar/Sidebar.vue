<template lang="pug">
div.sidebar(v-bind:class="{'sidebar-opened': $store.state.sidebarOpened}")
  MenuHeader
  Navigation
  MenuContent
  div.sidebar-overlay(v-on:click="$store.state.sidebarOpened=!$store.state.sidebarOpened" v-if="$store.state.sidebarOpened")
</template>

<script>
import MenuHeader from '@/components/Main/Sidebar/MenuHeader'
import Navigation from '@/components/Main/Sidebar/Navigation'
export default {
  name: 'Sidebar',
  components: {
    'MenuHeader': MenuHeader,
    'Navigation': Navigation,
    'MenuContent': window.asyncLoadComponents(import('@/components/Main/Sidebar/MenuContent'))
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
    &.sidebar-opened
      left: 0
@media (max-width: 679px)
  .sidebar-overlay
    position: absolute
    width: 100vw
    height: 100vh
</style>
