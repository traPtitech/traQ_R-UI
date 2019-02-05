<template lang="pug">
div
  h1
    | setting
  div
    h2
      |  プロフィール設定
    img.setting-user-icon(:src="iconFileId")
    input(type="file" v-on:change="addFile")
    p
      | 表示名
    input(v-model="displayName")
    p
      | Twitter ID
    input(v-model="twitterId")
    p
      | 新しいパスワード
    input(v-model="newPassword" type="password")
    p
      | 新しいパスワード(確認)
    input(v-model="checkNewPassword" type="password")
    br
    button(v-if="isChanged && !needPass" v-on:click="submit")
      | 更新
    div(v-if="isChanged && needPass")
      p
        | 現在のパスワード
      input(v-model="oldPassword" type="password")
      br
      button( v-on:click="submitWithCertification")
        | 更新
    p(v-if="done !== ''")
      | {{done}}が更新されました
    p(v-if="state === 'failed'")
      | {{error}}
  div
    h2
      | 全セッション破棄
    button(@click="deleteSessions")
      | 破棄
  div
    h2
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
  div
    h2
      | スタンプ新規登録
    input(type="file" v-on:change="addStampFile")
    input(v-model="stampName")
    button(v-if="stampFile && stampName.length > 0" v-on:click="addStamp")
      | 追加
  button(@click="back")
    | 戻る
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'Setting',
  data () {
    return {
      displayName: '',
      twitterId: '',
      icon: null,
      newPassword: '',
      checkNewPassword: '',
      oldPassword: '',
      stampFile: null,
      state: 'default',
      error: '',
      stampName: '',
      done: '',
      openMode: 'particular',
      openChannelName: 'random'
    }
  },
  methods: {
    addFile (event) {
      this.icon = event.target.files[0]
    },
    addStampFile (event) {
      this.stampFile = event.target.files[0]
    },
    async submit () {
      if (this.state === 'processing') {
        return
      }
      this.done = ''
      this.state = 'processing'
      const tasks = []
      if (this.icon) {
        tasks.push(client.changeIcon(this.icon).then(() => {
          this.done += 'アイコン '
        }))
        this.icon = null
      }
      if (this.displayName !== this.$store.state.me.displayName) {
        tasks.push(client.changeDisplayName(this.displayName).then(() => {
          this.done += '表示名 '
        }))
      }
      if (this.twitterId !== this.$store.state.me.twitterId) {
        tasks.push(client.changeTwitterId(this.twitterId).then(() => {
          this.done += 'Twitter ID '
        }))
      }
      return Promise.all(tasks).then(() => {
        this.state = 'successed'
        this.$store.dispatch('whoAmI')
        this.$store.dispatch('updateMembers')
      }).catch(e => {
        this.state = 'failed'
        this.error = '失敗しました'
      })
    },
    async submitWithCertification () {
      if (this.state === 'processing') {
        return
      }
      this.done = ''
      this.state = 'processing'
      if (this.newPassword !== '' && this.newPassword !== this.checkNewPassword) {
        this.state = 'failed'
        this.error = '新しいパスワードと確認用が異なります'
        return
      }
      if (this.oldPassword === '') {
        this.state = 'failed'
        this.error = '現在のパスワードが必要です'
        return
      }
      const tasks = []
      if (this.icon) {
        tasks.push(client.changeIcon(this.icon).then(() => {
          this.done += 'アイコン '
        }))
        this.icon = null
      }
      if (this.displayName !== this.$store.state.me.displayName) {
        tasks.push(client.changeDisplayName(this.displayName).then(() => {
          this.done += '表示名 '
        }))
      }
      if (this.twitterId !== this.$store.state.me.twitterId) {
        tasks.push(client.changeTwitterId(this.twitterId).then(() => {
          this.done += 'Twitter ID '
        }))
      }
      if (this.newPassword !== '') {
        tasks.push(client.changePassword(this.newPassword, this.oldPassword).then(() => {
          this.done += 'パスワード '
        }))
      }
      return Promise.all(tasks).then(() => {
        this.oldPassword = ''
        this.newPassword = ''
        this.checkNewPassword = ''
        this.state = 'successed'
        this.$store.dispatch('whoAmI')
      }).catch(e => {
        this.state = 'failed'
        this.error = '失敗しました'
      })
    },
    addStamp () {
      client.addStamp(this.stampName, this.stampFile)
      .then(() => {
        this.$store.dispatch('updateStamps')
        this.stampFile = null
        this.stampName = ''
      })
    },
    back () {
      if (this.$store.state.currentChannel['channelId']) {
        this.$router.push(`/channels/${this.$store.getters.getChannelPathById(this.$store.state.currentChannel.channelId)}`)
      } else {
        this.$router.push('/channels/random')
      }
    },
    updateBrowserSetting () {
      this.$store.dispatch('updateOpenMode', this.openMode)
      const channel = this.$store.getters.getChannelByName(this.openChannelName)
      this.$store.dispatch('updateOpenChannelId', channel.channelId)
    },
    deleteSessions () {
      if (window.confirm('ログイン中のセッションを全て破棄します。（実行するとログアウトされます）')) {
        client.deleteSessions().then(() => {
          this.$store.commit('setMe', null)
          this.$router.push('/login')
        })
      }
    }
  },
  computed: {
    iconFileId () {
      return `${this.$store.state.baseURL}/api/1.0/files/${this.$store.state.me.iconFileId}`
    },
    isChanged () {
      if (this.icon) return true
      if (this.displayName !== this.$store.state.me.displayName) return true
      if (this.twitterId !== this.$store.state.me.twitterId) return true
      if (this.newPassword !== '') return true
      if (this.checkNewPassword !== '') return true
      return false
    },
    needPass () {
      if (this.newPassword !== '') return true
      if (this.checkNewPassword !== '') return true
      return false
    },
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
  mounted () {
    this.displayName = this.$store.state.me.displayName
    this.twitterId = this.$store.state.me.twitterId
    this.openMode = this.$store.state.openMode
    this.openChannelName = this.$store.getters.getChannelPathById(this.$store.state.openChannelId)
  }
}
</script>

<style lang="sass">
.setting-user-icon
  width: 100px
  height: 100px
  background-color: white
  border-radius: 100%
</style>
