<template lang="pug">
  .channel-tab-switcher-wrap.drop-shadow
    .channel-tab-switcher-item(@click="channelView = 'tree'" :class="{selected: channelView === 'tree'}")
    .channel-tab-switcher-item(@click="channelView = 'stared'" :class="{selected: channelView === 'stared'}")
    .channel-tab-switcher-item(@click="channelView = 'activity'" :class="{selected: channelView === 'activity'}")
</template>

<script>
export default {
  name: 'ChannelListTabSwitcher',
  computed: {
    channelView: {
      get () {
        return this.$store.getters.channelView
      },
      set (mode) {
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
  width: 120px
  height: 30px
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
  width: calc( 100% / 3 )
  height: 100%
  cursor: pointer
  background: none
  &.selected
    background: $tertiary-color
</style>
