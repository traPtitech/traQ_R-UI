<template lang="pug">
div.sidebar(:class="sidebarClass" :style="sidebarStyle" ref="sidebar")
  navigation
  div.menu-content-wrapper
    Content
  Footer
  div.sidebar-overlay(draggable="false" @click="close" v-if="isSidebarOpened")
</template>

<script>
import Navigation from '@/components/Main/Sidebar/Navigation'
import Footer from '@/components/Main/Sidebar/Footer'
import { mapGetters } from 'vuex'

export default {
  name: 'Sidebar',
  props: {
    swipeEvent: Object
  },
  components: {
    Navigation,
    Content: window.asyncLoadComponents(import('@/components/Main/Sidebar/Content')),
    Footer
  },
  data () {
    return {
      isActive: false,
      swipeThresholdX: 50,
      sidebarWidth: 260
    }
  },
  computed: {
    ...mapGetters(['deviceType']),
    sidebarClass () {
      return {
        'is-sidebar-opened': this.isSidebarOpened,
        'drop-shadow': this.deviceType === 'pc' || (this.isSidebarOpened && this.deviceType === 'sp'),
        'is-swipe-active': this.isSwipeActive
      }
    },
    sidebarStyle () {
      if (this.deviceType === 'pc') {
        return {}
      }
      if (this.isOpenSwipeActive && !this.isSidebarOpened) {
        return {
          'transform': `translateX(${this.openSwipedX - this.sidebarWidth}px)`,
          'transition': 'none'
        }
      } else if (this.isCloseSwipeActive && this.isSidebarOpened) {
        const translateX = this.closeSwipedX < 10 ? 0 : this.closeSwipedX * -1
        return {
          'transform': `translateX(${translateX}px)`,
          'transition': 'none'
        }
      } else {
        return {}
      }
    },
    isSwipeActive () {
      return this.swipeEvent.isActive && this.deviceType === 'sp'
    },
    isOpenSwipeActive () {
      return this.isSwipeActive && this.swipeEvent.startX < this.swipeThresholdX
    },
    isCloseSwipeActive () {
      return this.isSwipeActive && this.swipeEvent.startX < this.sidebarWidth
    },
    openSwipedX () {
      return Math.min(this.swipeEvent.x - this.swipeEvent.startX, this.sidebarWidth)
    },
    closeSwipedX () {
      return Math.max(this.swipeEvent.startX - this.swipeEvent.x, 0)
    },
    ...mapGetters([
      'deviceType',
      'isSidebarOpened'
    ])
  },
  methods: {
    close () {
      this.$store.commit('closeSidebar')
      this.$store.commit('contractTitlebar')
    },
    open () {
      this.$store.commit('openSidebar')
    }
  },
  watch: {
    isOpenSwipeActive (newVar, oldVar) {
      if (!newVar && oldVar && this.openSwipedX > this.sidebarWidth / 4) {
        this.open()
      }
    },
    isCloseSwipeActive (newVar, oldVar) {
      if (!newVar && oldVar && this.closeSwipedX > this.sidebarWidth / 4) {
        this.close()
      }
    }
  }
}
</script>

<style lang="sass">
.sidebar
  background-color: white
  z-index: $sidebar-index
  +mq(pc)
    height: 100vh
    height: vh(100)
    position: relative
    grid-area: side
    will-change: none
  +mq(sp)
    height: calc(100vh - 50px)
    height: calc( #{vh(100)} - 50px)
    width: $sidebar-width
    position: fixed
    z-index: $sidebar-index
    transform: translateX(-102%)
    left: 0
    bottom: 0
    will-change: transform
    transition: transform .3s ease
    &.is-sidebar-opened
      transition: transform .3s ease-in-out
      transform: translateY(0)
    &.is-swipe-active
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
    height: vh(100)
    z-index: -100
    background-color: rgba(0,0,0,0.2)
    opacity: 0
    transition: opacity .5s

.menu-content-wrapper
  height: calc( 100% - #{$navigation-height} - #{$footer-height} )
  background-color: $primary-color
  position: relative
</style>
