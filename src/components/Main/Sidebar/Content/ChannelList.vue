<template lang="pug">
div.channel-list
  ChannelElement(v-for="model in $store.getters.childrenChannels('')" v-bind:key="model.channelId" :model="model" v-bind:curPath="''")
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
