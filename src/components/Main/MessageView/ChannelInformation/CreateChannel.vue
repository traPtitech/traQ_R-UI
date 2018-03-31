<template lang="pug">
div.create-channel
  div(@click="showModal")
    div.fas.fa-plus
  modal(:active="active" @close="active = false")
    div
      | 新しくチャンネルを作成する
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
export default {
  name: 'Topic',
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
</style>
