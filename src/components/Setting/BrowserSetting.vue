<template lang="pug">
.browser-setting
  SettingTitle
    | ブラウザ設定
  SettingItem
    SettingItemTitle
      | 全セッション破棄
    button(@click="deleteSessions")
      | 破棄
  SettingItem
    SettingItemTitle
      | ブラウザ設定
    p
      | 起動時
    div
      input(type="radio" value="particular" v-model="openMode" checked)
      | 特定のチャンネル
    div
      input(type="radio" value="lastOpen" v-model="openMode")
      | 最後に開いたチャンネル
    div(v-show="openMode === 'particular'")
      p
        | 起動時に開くチャンネル名
      input(v-model="openChannelName")
    p(v-if="!isChannelNameValid")
      | 存在しないチャンネル名です
    button(v-if="isBrowserSettingChanged && isChannelNameValid" @click="updateBrowserSetting")
      | 更新
</template>

<script>
import client from '@/bin/client'
import SettingTitle from '@/components/Setting/SettingTitle'
import SettingItem from '@/components/Setting/SettingItem'
import SettingItemTitle from '@/components/Setting/SettingItemTitle'
export default {
  name: 'ProfileSetting',
  components: {
    SettingTitle,
    SettingItem,
    SettingItemTitle
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
</style>
