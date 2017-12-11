<template lang="pug">
div.channelview
  Titlebar
  Content
  Information
</template>

<script>
import Titlebar from '@/components/Main/ChannelView/Titlebar'
import Content from '@/components/Main/ChannelView/Content'
import Information from '@/components/Main/Information/Information'

export default {
  components: {
    'Titlebar': Titlebar,
    'Content': Content,
    'Information': Information
  }
}
</script>

<style lang="sass">
.channelview
  display: grid
  width: 100%
  
</style>
