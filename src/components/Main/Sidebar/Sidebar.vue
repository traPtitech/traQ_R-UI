<template lang="pug">
div.sidebar(v-bind:style="{transform: `translateX(${translateX}px)`}" v-bind:class="{'sidebar-opened': $store.state.sidebarOpened}" v-on="{mousedown: mouseDown,mouseup: mouseUp, mousemove: mouseMove, touchstart: mouseDown, touchend: mouseUp, touchmove: mouseMove, mouseleave: mouseLeave}" ref="sidebar" draggable="false")
  MenuHeader
  Navigation
  MenuContent
  div.sidebar-overlay(draggable="false" v-on:click="close" v-bind:style="{opacity: translateX / width}" v-if="isActive || isOpened")
  div.slide-trigger(draggable="false" v-on="{mousedown: mouseDown,mouseup: mouseUp, mousemove: mouseMove, touchstart: mouseDown, touchend: mouseUp, touchmove: mouseMove}" v-bind:class="{'slide-active':isActive}")
</template>

<script>
import MenuHeader from '@/components/Main/Sidebar/MenuHeader'
import Navigation from '@/components/Main/Sidebar/Navigation'
export default {
  name: 'Sidebar',
  data () {
    return {
      isActive: false,
      mouseX: 0,
      mouseXStart: 0,
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
    'MenuContent': window.asyncLoadComponents(import('@/components/Main/Sidebar/MenuContent'))
  },
  methods: {
    mouseDown () {
      this.isActive = true
    },
    mouseUp () {
      this.isActive = false
    },
    mouseMove (e) {
      this.mouseX = e.x
    },
    mouseLeave () {
      this.isActive = false
    },
    close () {
      this.$store.commit('closeSidebar')
      this.translateX = 0
      this.isActive = false
    },
    open () {
      this.$store.commit('openSidebar')
      this.translateX = this.width
      this.isActive = false
    }
  },
  watch: {
    isOpened () {
      this.isOpened ? this.open() : this.close()
    },
    isActive () {
      if (this.isActive) {
        this.mouseXStart = this.mouseX
      } else {
        this.translateX > this.width / 2 ? this.open() : this.close()
      }
    },
    mouseX () {
      if (window.innerWidth >= 680) {
        return
      }
      if (this.isActive) {
        let offsetX = this.mouseX - this.mouseXStart
        offsetX = this.isOpened ? this.width + offsetX : offsetX
        this.translateX = offsetX
        this.translateX = Math.min(this.width, this.translateX)
        this.translateX = Math.max(this.translateX, 0)
      }
    }
  }
}
</script>

<style lang="sass">
@import "~@/styles/global.sass"
.sidebar
  display: grid
  grid-template-rows: 60px 1fr
  grid-template-columns: 50px 1fr
  grid-template-areas: "menu header" "menu content"
  height: 100vh
  background-color: white
  transition: all .1s linear
  +mq(pc)
    grid-area: side
  +mq(sp)
    width: 260px
    position: absolute
    z-index: 1000
    left: -260px
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
