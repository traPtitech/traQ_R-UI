<template lang="pug">
div.sidebar(v-bind:style="{transform: `translateX(${translateX}px)`}" v-bind:class="{'sidebar-opened': $store.state.sidebarOpened}" ref="sidebar")
  Navigation
  Content
  Footer
  div.sidebar-overlay(draggable="false" v-on:click="close" v-bind:style="{opacity: translateX / width}" v-if="isActive || isOpened")
</template>

<script>
import MenuHeader from '@/components/Main/Sidebar/MenuHeader'
import Navigation from '@/components/Main/Sidebar/Navigation'
import Footer from '@/components/Main/Sidebar/Footer'

export default {
  name: 'Sidebar',
  data () {
    return {
      isActive: false,
      translateX: 0
    }
  },
  computed: {
    width () {
      return this.$refs.sidebar.clientWidth
    },
    isOpened () {
      return this.$store.state.sidebarOpened
    }
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
      this.translateX = 0
    },
    open () {
      this.$store.commit('openSidebar')
      this.translateX = this.width
    }
  },
  watch: {
    isOpened () {
      this.isOpened ? this.open() : this.close()
    }
  }
}
</script>

<style lang="sass">
@import "~@/styles/global.sass"
.sidebar
  height: 100vh
  background-color: white
  transition: all .5s ease-in-out
  z-index: $sidebar-index
  +mq(pc)
    grid-area: side
  +mq(sp)
    width: $sidebar-width
    position: absolute
    z-index: $sidebar-index
    // left: -260px
    top: -100%
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
.slide-trigger
  +mq(sp)
    position: absolute
    top: 0
    right: 0
    transform: translateX(100%)
    height: 100%
    width: 20px
    z-index: -200
    &.slide-active
      width: 100vw
</style>
