<template lang="pug">
div.channel-topic
  div(@click="showModal")
    div.fas.fa-comment
  ChannelInformationModal(title="トピック設定" :active="active" @close="active = false")
    div.change-topic
      h2 トピックを変更する
      input(type="textarea" v-model="topicText")
      button(@click="changeChannelTopic")
        | 実行
</template>

<script>
import client from '@/bin/client'
import ChannelInformationModal from '@/components/Main/MessageView/ChannelInformation/ChannelInformationModal'
export default {
  name: 'Topic',
  components: {
    ChannelInformationModal
  },
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
.change-topic
  *
    margin: 1rem 0px
  h2
    grid-row: 1
    grid-column: 2
    align-self: center
    margin: 0px
    font-size: 1.5rem
  button
    margin: 0px 0.5rem
</style>

