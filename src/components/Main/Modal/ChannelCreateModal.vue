<template lang="pug">
base-common-modal(title="CREATE" tiny)
  icon-plus(color="var(--primary-color-on-bg)" slot="header-icon" size="24")
  .channel-create-modal
    h2.channel-create-description サブチャンネルを作成する
    .channel-create-input-wrap
      setting-input(:prefix="`#${fullChannelName}/`" type="textarea" v-model="channelName")
    p.channel-create-status(v-if="state === 'failed'")
      | 失敗しました
    p.channel-create-status(v-if="state === 'succeeded'")
      | 作成されました
    .channel-create-button-wrap
      setting-button.channel-create-button(v-if="state === 'succeeded'" @click="changeChannel")
        | 開く
      setting-button.channel-create-button(@click="createChannel")
        | 作成
</template>

<script>
import { mapState, mapActions } from 'vuex'
import client from '@/bin/client'
import MessageElement from '@/components/Main/MessageView/MessageElement/MessageElement'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import SettingButton from '@/components/Setting/SettingButton'
import SettingInput from '@/components/Setting/SettingInput'
import IconPlus from '@/components/Icon/IconPlus'

export default {
  name: 'MessageModal',
  components: {
    MessageElement,
    BaseCommonModal,
    SettingButton,
    SettingInput,
    IconPlus
  },
  data() {
    return {
      channelName: '',
      state: 'default',
      createdChannel: {}
    }
  },
  computed: {
    ...mapState('modal', ['data']),
    fullChannelName() {
      return this.$store.getters.getChannelPathById(
        this.currentChannel.channelId
      )
    },
    currentChannel() {
      return this.$store.state.currentChannel
    }
  },
  methods: {
    ...mapActions('modal', ['close']),
    channelNameById(channelId) {
      return this.$store.state.channelMap[channelId].name
    },
    createChannel() {
      this.state = 'processing'
      client
        .makeChannel(
          'public',
          [],
          this.channelName,
          this.$store.state.currentChannel.channelId
        )
        .then(res => {
          this.state = 'succeeded'
          this.createdChannel = res.data
        })
        .catch(() => {
          this.state = 'failed'
        })
    },
    changeChannel() {
      this.$store.commit('changeChannel', this.createdChannel)
      this.close()
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
  margin-left: 12px
</style>
