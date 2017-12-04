<template lang="pug">
  div.index
    Sidebar
    div.channel-view
    Information
</template>

<script>
import Information from '@/components/Main/Information/Information'
import Sidebar from '@/components/Main/Sidebar/Sidebar'

export default {
  name: 'index',
  data () {
    return {
    }
  },
  components: {
    'Information': Information,
    'Sidebar': Sidebar
  }
}
</script>

<style scoped lang="scss">
.index {
  display: flex;
  flex-flow: row;
}
</style>
