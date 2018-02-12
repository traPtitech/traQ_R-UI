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
import Information from '@/components/Main/MessageView/Information/Information'
import channelParser from '@/bin/channelParser'
import axios from 'axios'

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
  methods: {
    setChannelName: function () {
      let channelName = ''
      if (this.$route.params.channel5) channelName += '/' + this.$route.params.channel5
      if (this.$route.params.channel4) channelName += '/' + this.$route.params.channel4
      if (this.$route.params.channel3) channelName += '/' + this.$route.params.channel3
      if (this.$route.params.channel2) channelName += '/' + this.$route.params.channel2
      channelName += '/' + this.$route.params.channel
      if (channelName[0] === '/') channelName = channelName.substr(1)
      if (!this.$store.state.channelMap[channelName]) {
        this.$router.push({name: 'NotFound'})
      }
      this.$store.commit('setChannel', channelName)
    }
  },
  created: function () {
    if (!this.$route.params.channel) {
      this.$route.params.channel = 'random'
    }
    if (this.$store.state.channelData.length === 0) {
      let self = this
      axios.get(this.$store.state.url + '/api/1.0/channels', {
        withCredentials: true
      })
      .then(function (res) {
        self.$store.commit('setChannelData', channelParser(res.data))
        self.setChannelName()
      })
      .catch(function (err) {
        console.log(err)
        self.$router.push({
          name: 'Login'
        })
      })
    } else {
      this.setChannelName()
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
    grid-template-columns: 250px 1fr 40px
    grid-template-areas: "side titlebar titlebar""side content information"
  @media (max-width: 679px)
    grid-template-rows: 60px 1fr
    grid-template-columns: 1fr 40px
    grid-template-areas: "titlebar titlebar""content information"
</style>
