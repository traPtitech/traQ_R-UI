<template lang="pug">
.sidebar(:class="sidebarClass" :style="sidebarStyle" ref="sidebar")
  sidebar-tab-menu
  .menu-content-wrapper
    .filter-and-toggle-wrapper(v-if="['Channels', 'Members'].includes(menuContent) && channelView !== 'activity'")
      transition(name="filter-slide-up")
        filter-and-toggle(
          v-if="isFilterVisible"
          :filterText="filterText"
          @input="$store.commit('setFilterText', $event)"
          :isUnreadFiltered="isUnreadFiltered"
          @change="$store.commit('setIsUnreadFiltered', $event)"
          :hasDropShadow="filterHasDropShadow")
    Content(@scroll="scrollHandler")
    channel-list-tab-switcher(v-if="menuContent === 'Channels'")
  Footer
  .sidebar-overlay(draggable="false" @click="close" v-if="isSidebarOpened")
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarTabMenu from '@/components/Main/Sidebar/SidebarTabMenu'
import Footer from '@/components/Main/Sidebar/Footer'
import FilterAndToggle from '@/components/Util/FilterAndToggle'

export default {
  name: 'Sidebar',
  props: {
    swipeEvent: Object
  },
  components: {
    SidebarTabMenu,
    Content: window.asyncLoadComponents(
      import('@/components/Main/Sidebar/Content')
    ),
    Footer,
    ChannelListTabSwitcher: window.asyncLoadComponents(
      import('@/components/Main/Sidebar/Content/ChannelListTabSwitcher')
    ),
    FilterAndToggle
  },
  data() {
    return {
      isActive: false,
      swipeThresholdX: 50,
      sidebarWidth: 260,
      contentScrollTop: 0,
      isScrollToTop: false,
      lockFilter: false,
      currentMenuContent: 'Channels',
      currentChannelView: 'tree'
    }
  },
  computed: {
    ...mapGetters([
      'deviceType',
      'isSidebarOpened',
      'channelView',
      'filterText',
      'isUnreadFiltered'
    ]),
    menuContent() {
      return this.$store.state.menuContent
    },
    sidebarClass() {
      return {
        'is-sidebar-opened': this.isSidebarOpened,
        'drop-shadow':
          this.deviceType === 'pc' ||
          (this.isSidebarOpened && this.deviceType === 'sp'),
        'is-swipe-active': this.isSwipeActive
      }
    },
    sidebarStyle() {
      if (this.deviceType === 'pc') {
        return {}
      }
      if (this.isOpenSwipeActive && !this.isSidebarOpened) {
        return {
          transform: `translateX(${this.openSwipedX - this.sidebarWidth}px)`,
          transition: 'none'
        }
      } else if (this.isCloseSwipeActive && this.isSidebarOpened) {
        const translateX = this.closeSwipedX < 10 ? 0 : this.closeSwipedX * -1
        return {
          transform: `translateX(${translateX}px)`,
          transition: 'none'
        }
      } else {
        return {}
      }
    },
    isSwipeActive() {
      return this.swipeEvent.isActive && this.deviceType === 'sp'
    },
    isOpenSwipeActive() {
      return this.isSwipeActive && this.swipeEvent.startX < this.swipeThresholdX
    },
    isCloseSwipeActive() {
      return this.isSwipeActive && this.swipeEvent.startX < this.sidebarWidth
    },
    openSwipedX() {
      return Math.min(
        this.swipeEvent.x - this.swipeEvent.startX,
        this.sidebarWidth
      )
    },
    closeSwipedX() {
      return Math.max(this.swipeEvent.startX - this.swipeEvent.x, 0)
    },
    isFilterVisible() {
      if (this.contentScrollTop < 20) return true
      if (
        this.currentMenuContent !== this.menuContent ||
        this.currentChannelView !== this.channelView
      ) {
        return false
      }
      return this.isScrollToTop
    },
    filterHasDropShadow() {
      return this.contentScrollTop > 20
    }
  },
  methods: {
    close() {
      this.$store.commit('closeSidebar')
      this.$store.commit('contractTitlebar')
    },
    open() {
      this.$store.commit('openSidebar')
    },
    scrollHandler(scrollTop) {
      this.contentScrollTop = scrollTop
    }
  },
  watch: {
    isOpenSwipeActive(newVar, oldVar) {
      if (!newVar && oldVar && this.openSwipedX > this.sidebarWidth / 4) {
        this.open()
      }
    },
    isCloseSwipeActive(newVar, oldVar) {
      if (!newVar && oldVar && this.closeSwipedX > this.sidebarWidth / 4) {
        this.close()
      }
    },
    contentScrollTop(newVar, oldVar) {
      if (newVar < oldVar) {
        this.isScrollToTop = true
      } else {
        this.isScrollToTop = false
      }
    },
    menuContent(newVar) {
      this.$nextTick(() => {
        this.currentMenuContent = newVar
      })
    },
    channelView(newVar) {
      this.$nextTick(() => {
        this.currentChannelView = newVar
      })
    }
  }
}
</script>

<style lang="sass">
.sidebar
  background-color: white
  z-index: $sidebar-index
  width: $sidebar-width
  +mq(pc)
    height: 100%
    // height: vh(100)
    flex-shrink: 0
    position: relative
  +mq(sp)
    height: calc(100% - 50px)
    // height: calc( #{vh(100)} - 50px)
    position: absolute
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
    position: absolute
    top: 0
    right: 0
    left: 0
    width: 200%
    height: 100%
    // height: vh(100)
    z-index: -100
    background-color: rgba(0,0,0,0.2)
    opacity: 0
    transition: opacity .5s

.menu-content-wrapper
  height: calc( 100% - #{$navigation-height} - #{$footer-height} )
  background-color: $primary-color
  position: relative
  overflow: hidden

.filter-and-toggle-wrapper
  position: absolute
  width: 80%
  left: 0
  right: 0
  padding:
    top: 20px
  margin: auto
  z-index: $sidebar-index + 10

.filter-slide-up
  &-enter-active, &-leave-active
    transition: all .5s ease
    transform: translateY(0)
  &-enter, &-leave-to
    transform: translateY(-200%)
  &-leave-active
    position: absolute
</style>
