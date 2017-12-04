<template lang="pug">
  div.index
    Sidebar
    ChannelView
</template>

<script>
import Sidebar from '@/components/Main/Sidebar/Sidebar'
import ChannelView from '@/components/Main/ChannelView/ChannelView'

export default {
  name: 'index',
  data () {
    return {
    }
  },
  components: {
    'Sidebar': Sidebar,
    'ChannelView': ChannelView
  }
}
</script>

<style scoped lang="scss">
.index {
  display: flex;
  flex-flow: row;

}
</style>
