<template lang="pug">
div.index
  Sidebar
  Titlebar
  Content
  Information
</template>

<script>
import Sidebar from '@/components/Main/Sidebar/Sidebar'
import Titlebar from '@/components/Main/ChannelView/Titlebar'
import Content from '@/components/Main/ChannelView/Content'
import Information from '@/components/Main/Information/Information'

export default {
  name: 'index',
  data () {
    return {
    }
  },
  components: {
    'Sidebar': Sidebar,
    'Titlebar': Titlebar,
    'Content': Content,
    'Information': Information
  }
}
</script>

<style scoped lang="sass">
.index
  display: grid
  position: relative
  grid-gap: 0
  @media (min-width: 480px)
    grid-template-rows: 80px 1fr
    grid-template-columns: 200px 1fr 15vw
    grid-template-areas: "side titlebar titlebar""side content information"
  @media (max-width: 479px)
    grid-template-rows: 80px 1fr
    grid-template-columns: 1fr
    grid-template-areas: "titlebar""content"
</style>
