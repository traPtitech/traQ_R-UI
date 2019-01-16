<template lang="pug">
div.sidebar(:class="sidebarClass" ref="sidebar")
  Navigation
  div.menu-content-wrapper
    Content
  Footer
  div.sidebar-overlay(draggable="false" @click="close" v-if="isSidebarOpened")
</template>

<script>
import MenuHeader from '@/components/Main/Sidebar/MenuHeader'
import Navigation from '@/components/Main/Sidebar/Navigation'
import Footer from '@/components/Main/Sidebar/Footer'
import { mapGetters } from 'vuex'

export default {
  name: 'Sidebar',
  data () {
    return {
      isActive: false
    }
  },
  computed: {
    sidebarClass () {
      return {
        'is-sidebar-opened': this.isSidebarOpened,
        'drop-shadow': this.deviceType === 'sp'
      }
    },
    ...mapGetters([
      'deviceType',
      'isSidebarOpened'
    ])
  },
  components: {
    'MenuHeader': MenuHeader,
    'Navigation': Navigation,
    'Content': window.asyncLoadComponents(import('@/components/Main/Sidebar/Content')),
    'Footer': Footer
  },
  methods: {
    close () {
      this.$store.commit('closeSidebar')
      this.$store.commit('contractTitlebar')
    },
    open () {
      this.$store.commit('openSidebar')
    }
  }
}
</script>

<style lang="sass">
.sidebar
  background-color: white
  transition: all .3s ease-in-out
  z-index: $sidebar-index
  +mq(pc)
    height: 100vh
    position: relative
    grid-area: side
  +mq(sp)
    height: calc(100vh - 50px)
    width: $sidebar-width
    position: fixed
    z-index: $sidebar-index
    left: -100%
    bottom: 0
    &.is-sidebar-opened
      left: 0
  @media only screen and (device-width : 375px) and (device-height : 812px) and (-webkit-device-pixel-ratio : 3) and (orientation: landscape)
    padding-left: calc(env(safe-area-inset-left) - 7px)
    background-color: #3a4891
.sidebar-overlay
  +mq(sp)
    position: fixed
    top: 0
    right: 0
    left: 0
    width: 200vw
    height: 100vh
    z-index: -100
    background-color: rgba(0,0,0,0.2)
    opacity: 0
    transition: opacity .5s
.menu-content-wrapper
  height: calc( 100% - #{$navigation-height} - #{$footer-height} )
  overflow: scroll
  -webkit-overflow-scrolling: touch
  background-color: $primary-color
</style>
