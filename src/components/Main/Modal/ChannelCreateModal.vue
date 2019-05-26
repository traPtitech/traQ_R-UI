<template lang="pug">
base-common-modal(title="CREATE" tiny)
  icon-plus(color="var(--primary-color-on-bg)" slot="header-icon" size="24")
  .channel-create-modal
    h2.channel-create-description サブチャンネルを作成する
    .channel-create-input-wrap
      setting-input(:prefix="`#${fullChannelName}/`" type="textarea" v-model="channelName")
    p.channel-create-status(v-if="state === 'failed'")
      | 失敗しました
    p.channel-create-status(v-if="state === 'successed'")
      | 作成されました
    .channel-create-button-wrap
      setting-button(@click="createChannel")
        | 作成
</template>

<script>
import { mapState } from 'vuex'
import client from '@/bin/client'
import MessageElement from '@/components/Main/MessageView/MessageElement/MessageElement'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import SettingButton from '@/components/Setting/SettingButton'
import SettingInput from '@/components/Setting/SettingInput'
import IconPlus from '@/components/Icon/IconPlus'

export default {
  name: 'PinnedModal',
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
      state: 'default'
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
    channelNameById(channelId) {
      return this.$store.state.channelMap[channelId].name
    },
    createChannel() {
      this.state = 'processing'
      client
        .makeChannel({
          private: false,
          member: [],
          name: this.channelName,
          parent: this.$store.state.currentChannel.channelId
        })
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
</style>
