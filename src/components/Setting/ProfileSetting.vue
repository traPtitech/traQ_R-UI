<template lang="pug">
.profile-setting
  SettingTitle
    | プロフィール設定
  img.setting-user-icon(:src="iconFileId")
  SettingFileInput.setting-icon-input(v-model="icon" label="アイコンを変更" name="icon")
  SettingInput(v-model="displayName" label="表示名")
  SettingInput(v-model="twitterId" label="Twitter ID")
  SettingInput(v-model="newPassword" type="password" label="新しいパスワード")
  SettingInput(v-model="checkNewPassword" type="password" label="新しいパスワード(確認)")
  br
  SettingButton(v-if="isChanged && !needPass" @click="submit")
    | 更新
  div(v-if="isChanged && needPass")
    SettingInput(v-model="oldPassword" type="password" label="現在のパスワード")
    br
    SettingButton(@click="submitWithCertification")
      | 更新
  p.update-info(v-if="done !== ''")
    | {{done}}が更新されました
  p.update-info(v-if="state === 'failed'")
    | {{error}}
</template>

<script>
import client from '@/bin/client'
import SettingTitle from '@/components/Setting/SettingTitle'
import SettingInput from '@/components/Setting/SettingInput'
import SettingFileInput from '@/components/Setting/SettingFileInput'
import SettingButton from '@/components/Setting/SettingButton'
export default {
  name: 'ProfileSetting',
  components: {
    SettingTitle,
    SettingInput,
    SettingFileInput,
    SettingButton
  },
  data () {
    return {
      state: 'default',
      done: '',
      displayName: '',
      twitterId: '',
      newPassword: '',
      checkNewPassword: '',
      oldPassword: '',
      icon: null
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
    }
  },
  methods: {
    addFile (event) {
      this.icon = event.target.files[0]
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
      if (this.newPassword.length < 10 || this.newPassword.length > 32) {
        this.state = 'failed'
        this.error = '新しいパスワードは10文字以上32文字以下でなければなりません'
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
        tasks.push(client.changePassword(this.oldPassword, this.newPassword).then(() => {
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
    }
  },
  mounted () {
    this.displayName = this.$store.state.me.displayName
    this.twitterId = this.$store.state.me.twitterId
  }
}
</script>

<style lang="sass">
.setting-user-icon
  width: 100px
  height: 100px
  background-color: white
  border-radius: 100%

.setting-icon-input
  margin:
    top: 1rem
    bottom: 2rem

.update-info
  margin-top: 0.75rem
</style>
