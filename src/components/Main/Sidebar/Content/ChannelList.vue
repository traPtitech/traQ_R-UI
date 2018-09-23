<template lang="pug">
div.channel-list
  transition(name="slide" mode="out-in")
    keep-alive
      div.list-channels
        ChannelElement(v-for="model in $store.getters.childrenChannels('')" v-bind:key="model.channelId" :model="model")
      div.stared-channels
        ChannelElement(v-for="model in $store.getters.getStaredChannels" :key="'star' + model.channelId" :model="model")
</template>

<script>
import ChannelElement from '@/components/Main/Sidebar/Content/ChannelElement'
export default {
  name: 'ChannelList',
  data () {
    return {}
  },
  components: {
    'ChannelElement': ChannelElement
  }
}
</script>

<style lang="sass">
.channel-list
  user-select: none
</style>
