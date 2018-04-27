<template lang="pug">
div.create-channel
  div(@click="showModal")
    icon(name="plus")
  ChannelInformationModal(title="チャンネル作成" :active="active" @close="active = false")
    div.create-channel-modal
      h2 新しくチャンネルを作成する
      input(type="textarea" v-model="channelName")
      button(@click="createChannel")
        | 作成
      p(v-if="state === 'failed'")
        | 失敗しました
      p(v-if="state === 'successed'")
        | 作成されました
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
      channelName: '',
      state: 'default'
    }
  },
  methods: {
    createChannel () {
      this.state = 'processing'
      client.makeChannel('public', [], this.channelName, this.$store.state.currentChannel.channelId)
      .then(() => {
        this.state = 'successed'
      })
      .catch(() => {
        this.state = 'failed'
      })
    },
    showModal () {
      this.active = true
      this.channelName = ''
      this.state = 'default'
    }
  }
}
</script>
<style lang="sass">
.create-channel-modal
  *
    margin: 1rem 0px
  button
    margin: 0px 0.5rem
</style>
