<template lang="pug">
div.index
  Titlebar
  Message
  Information
  Sidebar
</template>

<script>
import Sidebar from '@/components/Main/Sidebar/Sidebar'
import Titlebar from '@/components/Main/MessageView/Titlebar'
import Message from '@/components/Main/MessageView/MessageContainer'
import Information from '@/components/Main/MessageView/ChannelInformation/ChannelInformation'

export default {
  name: 'index',
  data () {
    return {
    }
  },
  components: {
    'Sidebar': Sidebar,
    'Titlebar': Titlebar,
    'Message': Message,
    'Information': Information
  },
  async created () {
    if (!this.$route.params.channel) {
      this.$router.push('/channels/random')
    }
  },
  watch: {
    '$route' () {
      console.log(this.$route.params.channel)
    }
  }
}
</script>

<style lang="sass">
.index
  display: grid
  position: relative
  grid-gap: 0
  width: 100vw
  height: 100vh
  @media (min-width: 680px)
    grid-template-rows: 60px 1fr
    grid-template-columns: 260px 1fr 40px
    grid-template-areas: "side titlebar titlebar""side content information"
  @media (max-width: 679px)
    grid-template-rows: 60px 1fr
    grid-template-columns: 1fr 40px
    grid-template-areas: "titlebar titlebar""content information"
</style>
