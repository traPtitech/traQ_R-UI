<template lang="pug">
.browser-setting
  SettingTitle
    | ブラウザ設定
  SettingItem
    SettingItemTitle
      | アカウント
    SettingButton(@click="logout")
      | ログアウト
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
    SettingItemTitle
      | メッセージの送信スタイル
    .message-send-key-selector
      input(type="radio" value="modifier" v-model="messageSendKey" checked)
      | 修飾キー(
      span(v-for="(key, i) in messageSendModifierKeys")
        span.key {{key}}
        span(v-if="i + 1 !== messageSendModifierKeys.length") /
      | ) +
      span.key Enter
      | で送信
    .message-send-key-selector
      input(type="radio" value="none" v-model="messageSendKey")
      span.key Enter
      | で送信
    SettingButton(v-if="isBrowserSettingChanged && isChannelNameValid" @click="updateBrowserSetting")
      | 更新
</template>

<script>
import client from '@/bin/client'
import { isMac } from '@/bin/utils'
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
  data() {
    return {
      state: 'default',
      done: '',
      openMode: 'particular',
      openChannelName: 'random',
      messageSendKey: 'modifier'
    }
  },
  computed: {
    isBrowserSettingChanged() {
      if (!this.isChannelNameValid) {
        return false
      }
      return (
        this.openMode !== this.$store.state.openMode ||
        this.openChannelName !==
          this.$store.getters.getChannelPathById(
            this.$store.state.openChannelId
          ) ||
        this.messageSendKey !== this.$store.state.messageSendKey
      )
    },
    isChannelNameValid() {
      return this.$store.getters.getChannelByName(this.openChannelName)
    },
    messageSendModifierKeys() {
      if (isMac()) {
        return ['Shift', '⌥(Option)', 'Ctrl', '⌘(Command)']
      } else {
        return ['Shift', 'Alt', 'Ctrl']
      }
    }
  },
  methods: {
    deleteSessions() {
      if (
        window.confirm(
          'ログイン中のセッションを全て破棄します。（実行するとログアウトされます）'
        )
      ) {
        client.deleteSessions().then(() => {
          this.$store.commit('setMe', null)
          this.$router.push('/login')
        })
      }
    },
    updateBrowserSetting() {
      this.$store.dispatch('updateOpenMode', this.openMode)
      const channel = this.$store.getters.getChannelByName(this.openChannelName)
      this.$store.dispatch('updateOpenChannelId', channel.channelId)
      this.$store.dispatch('updateMessageSendKey', this.messageSendKey)
    },
    logout() {
      client.logout().then(() => {
        this.$store.commit('setMe', null)
        this.$router.push({ path: '/' })
      })
    }
  },
  mounted() {
    this.openMode = this.$store.state.openMode
    this.openChannelName = this.$store.getters.getChannelPathById(
      this.$store.state.openChannelId
    )
    this.messageSendKey = this.$store.state.messageSendKey
  }
}
</script>

<style lang="sass">
.open-mode-selector, .message-send-key-selector
  margin: 1rem 0
  input
    margin-right: 0.5rem
.open-channel-selector
  margin-top: -1rem
.key
  display: inline-block;
  background: #ddd;
  border:
    color: #666;
    style: solid;
    width: 1px;
    radius: 5px;
  padding: 4px 8px;
  margin: 2px 4px;
  box-shadow: 0px 1px #999;
</style>
