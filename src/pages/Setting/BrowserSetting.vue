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
      | 通知: {{notifyPermissionStatusText}}
    SettingButton(v-if="notifyPermissionStatus === 'default'" @click="requestNotifyPermission")
      | 設定
    span(v-else)
      | ブラウザや端末の設定から変更できます
  SettingItem
    SettingItemTitle
      | 起動時チャンネル設定
    label.open-mode-selector
      input(type="radio" value="lastOpen" v-model="openMode")
      | 最後に開いたチャンネル
    label.open-mode-selector.open-patiular-channel
      input(type="radio" value="particular" v-model="openMode" checked)
      | 特定のチャンネル
    .open-channel-selector(v-show="openMode === 'particular'")
      SettingInput(v-model="openChannelName")
    p(v-if="!isChannelNameValid")
      | 存在しないチャンネル名です
    SettingItemTitle
      | メッセージの送信スタイル
    label.message-send-key-selector
      input(type="radio" value="modifier" v-model="messageSendKey" checked)
      | 修飾キー(
      span(v-for="(key, i) in messageSendModifierKeys" :key="key")
        span.key {{key}}
        span(v-if="i + 1 !== messageSendModifierKeys.length") /
      | ) +
      span.key Enter
      | で送信
    label.message-send-key-selector
      input(type="radio" value="none" v-model="messageSendKey")
      span.key Enter
      | で送信
    SettingItemTitle
      | 省エネモード
    span.note
      | 省エネモードがONの場合、スタンプエフェクトのアニメーションを表示しません
    label.open-mode-selector
      input(type="radio" value="enabled" v-model="ecoModeEnabled")
      | ON
    label.open-mode-selector.open-patiular-channel
      input(type="radio" value="disabled" v-model="ecoModeEnabled" checked)
      | OFF
    SettingButton.update-button(v-if="isBrowserSettingChanged && isChannelNameValid" @click="updateBrowserSetting")
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
      messageSendKey: 'modifier',
      notifyPermissionStatus: '',
      ecoModeEnabled: 'disabled'
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
        this.messageSendKey !== this.$store.state.messageSendKey ||
        this.ecoMode !== this.$store.state.ecoMode
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
    },
    notifyPermissionStatusText() {
      return {
        default: '未設定（通知は来ません）',
        granted: '許可',
        denied: '拒否'
      }[this.notifyPermissionStatus]
    },
    ecoMode() {
      return this.ecoModeEnabled === 'enabled'
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
      this.$store.dispatch('updateEcoMode', this.ecoMode)
    },
    logout() {
      client.logout().then(() => {
        this.$store.commit('setMe', null)
        this.$router.push({ path: '/' })
      })
    },
    updateNotifyPermissionStatus() {
      this.notifyPermissionStatus = Notification.permission
    },
    requestNotifyPermission() {
      Notification.requestPermission(permission => {
        this.updateNotifyPermissionStatus()
      })
    }
  },
  mounted() {
    this.openMode = this.$store.state.openMode
    this.openChannelName = this.$store.getters.getChannelPathById(
      this.$store.state.openChannelId
    )
    this.messageSendKey = this.$store.state.messageSendKey
    this.ecoModeEnabled = this.$store.state.ecoMode ? 'enabled' : 'disabled'
    this.updateNotifyPermissionStatus()
  }
}
</script>

<style lang="sass">
.open-mode-selector, .message-send-key-selector
  display: block
  margin: 1rem 0
  input
    margin-right: 0.5rem
  cursor: pointer
.open-channel-selector
  margin-top: -1rem
.key
  display: inline-block
  background: var(--key-background-color)
  border:
    color: var(--key-border-color)
    style: solid
    width: 1px
    radius: 5px
  color: var(--key-text-color)
  padding: 4px 8px
  margin: 2px 4px
  box-shadow: 0px 1px var(--key-shadow-color)

.note
  font-size: 0.9rem

.update-button
  margin: 1rem 0
</style>
