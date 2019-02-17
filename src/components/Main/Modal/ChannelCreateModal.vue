<template lang="pug">
BaseCommonModal(title="CREATE" small)
  icon-plus(color="var(--primary-color-on-bg)" slot="header-icon" :size="24")
  .channel-create-modal
    h2.channel-create-description 子チャンネルを作成する
    .channel-create-input-wrap
      input.channel-create-input(type="textarea" v-model="channelName")
    p.channel-create-status(v-if="state === 'failed'")
      | 失敗しました
    p.channel-create-status(v-if="state === 'successed'")
      | 作成されました
    .channel-create-button-wrap
      button.channel-create-button(@click="createChannel")
        | 作成
</template>

<script>
import { mapState } from 'vuex'
import client from '@/bin/client'
import MessageElement from '@/components/Main/MessageView/MessageElement/MessageElement'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import IconPlus from '@/components/Icon/IconPlus'

export default {
  name: 'PinnedModal',
  components: {
    MessageElement,
    BaseCommonModal,
    IconPlus
  },
  data () {
    return {
      channelName: '',
      state: 'default'
    }
  },
  computed: {
    ...mapState('modal', ['data'])
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
    }
  }
}
</script>

<style lang="sass">
.channel-create-description
  margin-bottom: 1rem
  color: $primary-color-on-bg
  font:
    size: 1.2rem
    weight: 200
.channel-create-status
  margin-top: 0.5rem
  color: $text-color

.channel-create-button-wrap
  width: 100%
  display: flex
  justify-content: flex-end
.channel-create-button
  border: 1px solid $primary-color-on-bg
  margin-left: auto

.channel-create-input
  max-width: 100%
  padding:
    top: 4px
    right: 20px
    left: 10px
    bottom: 4px
  border-radius: 4px
  background: rgba(255,255,255,0.2)
  color: $text-light-color
  box-sizing: border-box
  &::placeholder
    color: $text-light-color
    opacity: 0.8
</style>
