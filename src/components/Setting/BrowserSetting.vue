<template lang="pug">
.browser-setting
  SettingTitle
    | ブラウザ設定
  SettingItem
    SettingItemTitle
      | 全セッション破棄
    SettingButton(@click="deleteSessions")
      | 破棄
  SettingItem
    SettingItemTitle
      | 起動時チャンネル設定
    .open-mode-selector
      input(type="radio" value="lastOpen" v-model="openMode")
      | 最後に開いたチャンネル
    .open-mode-selector.open-patiular-channel
      input(type="radio" value="particular" v-model="openMode" checked)
      | 特定のチャンネル
    .open-channel-selector(v-show="openMode === 'particular'")
      SettingInput(v-model="openChannelName")
    p(v-if="!isChannelNameValid")
      | 存在しないチャンネル名です
    SettingButton(v-if="isBrowserSettingChanged && isChannelNameValid" @click="updateBrowserSetting")
      | 更新
</template>

<script>
import client from '@/bin/client'
import SettingTitle from '@/components/Setting/SettingTitle'
import SettingItem from '@/components/Setting/SettingItem'
import SettingItemTitle from '@/components/Setting/SettingItemTitle'
import SettingInput from '@/components/Setting/SettingInput'
import SettingButton from '@/components/Setting/SettingButton'
export default {
  name: 'ProfileSetting',
  components: {
    SettingTitle,
    SettingItem,
    SettingItemTitle,
    SettingInput,
    SettingButton
  },
  data () {
    return {
      state: 'default',
      done: '',
      openMode: 'particular',
      openChannelName: 'random'
    }
  },
  computed: {
    isBrowserSettingChanged () {
      if (!this.isChannelNameValid) {
        return false
      }
      return this.openMode !== this.$store.state.openMode || this.openChannelName !== this.$store.getters.getChannelPathById(this.$store.state.openChannelId)
    },
    isChannelNameValid () {
      return this.$store.getters.getChannelByName(this.openChannelName)
    }
  },
  methods: {
    deleteSessions () {
      if (window.confirm('ログイン中のセッションを全て破棄します。（実行するとログアウトされます）')) {
        client.deleteSessions().then(() => {
          this.$store.commit('setMe', null)
          this.$router.push('/login')
        })
      }
    },
    updateBrowserSetting () {
      this.$store.dispatch('updateOpenMode', this.openMode)
      const channel = this.$store.getters.getChannelByName(this.openChannelName)
      this.$store.dispatch('updateOpenChannelId', channel.channelId)
    }
  },
  mounted () {
    this.openMode = this.$store.state.openMode
    this.openChannelName = this.$store.getters.getChannelPathById(this.$store.state.openChannelId)
  }
}
</script>

<style lang="sass">
.open-mode-selector
  margin: 1rem 0
.open-channel-selector
  margin-top: -1rem
</style>
