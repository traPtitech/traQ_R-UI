<template lang="pug">
div
  div(@click="showModal")
    | topic
  modal(:active="active" @close="active = false")
    div
      | トピックを変更する
    input(type="textarea" v-model="topicText")
    button(@click="changeChannelTopic")
      | 実行
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'Topic',
  data () {
    return {
      active: false,
      topicText: ''
    }
  },
  methods: {
    changeChannelTopic () {
      client.changeChannelTopic(this.$store.state.currentChannel.channelId, this.topicText)
      .then(res => {
        this.$store.commit('setCurrentChannelTopic', res.data)
      })
    },
    showModal () {
      this.active = true
      this.topicText = this.$store.state.currentChannelTopic.text
    }
  }
}
</script>

<style lang="sass">

</style>

