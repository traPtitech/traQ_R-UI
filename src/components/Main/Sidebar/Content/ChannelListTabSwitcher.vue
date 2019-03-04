<template lang="pug">
  .channel-tab-switcher-wrap.drop-shadow
    .channel-tab-switcher-item(@click="channelView = 'tree'" :class="{selected: channelView === 'tree'}")
      .channel-tab-switcher-item-icon.flex-center
        IconHash(:size="16")
    .channel-tab-switcher-item(@click="channelView = 'stared'" :class="{selected: channelView === 'stared'}")
      .channel-tab-switcher-item-icon.flex-center
        IconStarFill(:size="18")
    .channel-tab-switcher-item(@click="channelView = 'activity'" :class="{selected: channelView === 'activity'}")
      .channel-tab-switcher-item-icon.flex-center
        IconLightning(:size="18")
</template>

<script>
import IconHash from '@/components/Icon/IconHash'
import IconStarFill from '@/components/Icon/IconStarFill'
import IconLightning from '@/components/Icon/IconLightning'
export default {
  name: 'ChannelListTabSwitcher',
  components: {
    IconHash,
    IconStarFill,
    IconLightning
  },
  computed: {
    channelView: {
      get() {
        return this.$store.getters.channelView
      },
      set(mode) {
        this.$store.commit('setChannelView', mode)
      }
    }
  }
}
</script>

<style lang="sass">
.channel-tab-switcher-wrap
  position: absolute
  bottom: 10px
  width: 200px
  height: 35px
  right: 0
  left: 0
  margin: 0 auto
  background: $secondary-color
  z-index: $sidebar-index + 10
  border-radius: 30px
  overflow: hidden
  animation: fade-in .5s ease

.channel-tab-switcher-item
  display: inline-block
  position: relative
  width: calc( 100% / 3 )
  height: 100%
  cursor: pointer
  background: none
  &:hover
    background: rgba(0,0,0,0.1)

  &.selected
    background: $tertiary-color

.channel-tab-switcher-item-icon
  position: absolute
  left: 50%
  top: 50%
  opacity: 0.5
  width: 20px
  height: 20px
  transform: translateX(-50%) translateY(-50%)
  .selected &
    opacity: 1
</style>
