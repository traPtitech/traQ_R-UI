<template lang="pug">
div
  p.content-title
    | Channels
  transition-group(name="list-complete" tag="div" appear)
      div(v-for="model in $store.getters.childrenChannels('')" :key="model.channelId").channel-list-container
        ChannelElement(:model="model" :curPath="''")
</template>

<script>
import ChannelElement from '@/components/Main/Sidebar/Content/ChannelElement'
export default {
  data () {
    return {}
  },
  components: {
    'ChannelElement': ChannelElement
  }
}
</script>

<style lang="sass">
.channel-list-container
  position: relative
.content-title
  color: white
  font-weight: bold
// .list-complete-enter, .list-complete-leave-to
//   opacity: 0
//   transform: translateY(30px)
//   transition: all .5s ease
// .list-complete-enter-to, .list-complete-leave-to
//   opacity: 1
// .list-complete-enter-active, .list-complete-leave-active
//   position: absolute
.list-complete-enter
  opacity: 0
  // transform: translateY(-10px)
.list-complete-enter-active,.list-complete-leave-active
  transition: opacity 0.2s ease-in-out
  display: static
.list-complete-enter-to
  opacity: 1
.list-complete-leave-to
  opacity: 0
.list-complete-move
  // transition: all 0.5s ease-in-out
  // transition: transform 1s
</style>
