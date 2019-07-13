<template lang="pug">
.profile-setting
  SettingTitle
    | プロフィール設定
  img.setting-user-icon(:src="iconSrc")
  SettingFileInput.setting-icon-input(
    v-model="rawIconFile"
    :max-size="2 * 1000 * 1000"
    @load="onFileLoad"
    name="icon-edit"
    label="ファイルを選択")
  .profile-image-editor(v-if="encodedFile")
    ImageCropper(
      v-model="croppedBlob"
      :imageData="encodedFile"
      rounded)
  SettingInput(v-model="displayName" label="表示名")
  SettingInput(v-model="twitterId" label="Twitter ID")
  // SettingInput(v-model="newPassword" type="password" label="新しいパスワード")
  // SettingInput(v-model="checkNewPassword" type="password" label="新しいパスワード(確認)")
  .profile-setting-password
    | パスワードの変更は
    a(href="https://portal.trap.jp/" target="_blank") traPortal
    | から可能です
  br
  SettingButton(v-if="isChanged && !needPass" @click="submit")
    | 更新
  // div(v-if="isChanged && needPass")
  //   SettingInput(v-model="oldPassword" type="password" label="現在のパスワード")
  //   br
  //   SettingButton(@click="submitWithCertification")
  //     | 更新
  p.update-info(v-if="done !== ''")
    | {{done}}が更新されました
  p.update-info(v-if="state === 'failed'")
    | {{error}}
</template>

<script>
import client from '@/bin/client'
import ImageCropper from '@/components/Setting/ImageCropper'
import SettingTitle from '@/components/Setting/SettingTitle'
import SettingInput from '@/components/Setting/SettingInput'
import SettingFileInput from '@/components/Setting/SettingFileInput'
import SettingButton from '@/components/Setting/SettingButton'
export default {
  name: 'ProfileSetting',
  components: {
    ImageCropper,
    SettingTitle,
    SettingInput,
    SettingFileInput,
    SettingButton
  },
  data() {
    return {
      state: 'default',
      encodedFile: null, // base64エンコードされた選択中のファイル
      croppedBlob: null, // 切り抜かれた画像のBlob
      croppedBlobEncoded: null, // 切り抜かれた画像のData URL
      done: '',
      displayName: '',
      twitterId: '',
      newPassword: '',
      checkNewPassword: '',
      oldPassword: '',
      rawIconFile: null
    }
  },
  computed: {
    icon() {
      return this.croppedBlob || this.rawIconFile
    },
    iconSrc() {
      return this.croppedBlobEncoded || this.iconFileId
    },
    iconFileId() {
      if (!this.$store.state.me) {
        return ''
      }
      return `${this.$store.state.baseURL}/api/1.0/files/${
        this.$store.state.me.iconFileId
      }`
    },
    isChanged() {
      if (this.icon) return true
      if (
        this.$store.state.me &&
        this.displayName !== this.$store.state.me.displayName
      )
        return true
      if (
        this.$store.state.me &&
        this.twitterId !== this.$store.state.me.twitterId
      )
        return true
      if (this.newPassword !== '') return true
      if (this.checkNewPassword !== '') return true
      return false
    },
    needPass() {
      if (this.newPassword !== '') return true
      if (this.checkNewPassword !== '') return true
      return false
    }
  },
  methods: {
    onFileLoad(dataUrl) {
      this.encodedFile = dataUrl
    },
    async submitWithCertification() {
      if (this.state === 'processing') {
        return
      }
      this.done = ''
      this.state = 'processing'
      if (
        this.newPassword !== '' &&
        this.newPassword !== this.checkNewPassword
      ) {
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
        this.error =
          '新しいパスワードは10文字以上32文字以下でなければなりません'
        return
      }
      const tasks = []
      if (this.icon) {
        tasks.push(
          client.changeIcon(this.icon).then(() => {
            this.done += 'アイコン '
          })
        )
        this.rawIconFile = null
        this.encodedFile = null
        this.croppedBlob = null
        this.croppedBlobEncoded = null
      }
      if (
        this.$store.state.me &&
        this.displayName !== this.$store.state.me.displayName
      ) {
        tasks.push(
          client.changeDisplayName(this.displayName).then(() => {
            this.done += '表示名 '
          })
        )
      }
      if (
        this.$store.state.me &&
        this.twitterId !== this.$store.state.me.twitterId
      ) {
        tasks.push(
          client.changeTwitterId(this.twitterId).then(() => {
            this.done += 'Twitter ID '
          })
        )
      }
      if (this.newPassword !== '') {
        tasks.push(
          client.changePassword(this.oldPassword, this.newPassword).then(() => {
            this.done += 'パスワード '
          })
        )
      }
      return Promise.all(tasks)
        .then(() => {
          this.oldPassword = ''
          this.newPassword = ''
          this.checkNewPassword = ''
          this.state = 'successed'
          this.$store.dispatch('whoAmI')
        })
        .catch(() => {
          this.state = 'failed'
          this.error = '失敗しました'
        })
    },
    async submit() {
      if (this.state === 'processing') {
        return
      }
      this.done = ''
      this.state = 'processing'
      const tasks = []
      if (this.icon) {
        tasks.push(
          client.changeIcon(this.icon).then(() => {
            this.done += 'アイコン '
          })
        )
        this.rawIconFile = null
        this.encodedFile = null
        this.croppedBlob = null
      }
      if (
        this.$store.state.me &&
        this.displayName !== this.$store.state.me.displayName
      ) {
        tasks.push(
          client.changeDisplayName(this.displayName).then(() => {
            this.done += '表示名 '
          })
        )
      }
      if (
        this.$store.state.me &&
        this.twitterId !== this.$store.state.me.twitterId
      ) {
        tasks.push(
          client.changeTwitterId(this.twitterId).then(() => {
            this.done += 'Twitter ID '
          })
        )
      }
      return Promise.all(tasks)
        .then(() => {
          this.state = 'successed'
          this.$store.dispatch('whoAmI')
          this.$store.dispatch('updateMembers')
        })
        .catch(() => {
          this.state = 'failed'
          this.error = '失敗しました'
        })
    }
  },
  watch: {
    croppedBlob() {
      const reader = new FileReader()
      reader.onload = e => {
        this.croppedBlobEncoded = e.target.result
      }
      reader.readAsDataURL(this.croppedBlob)
    }
  },
  mounted() {
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

.profile-image-editor
  margin-bottom: 1rem

.profile-setting-password-disabled
  opacity: 0.5

.profile-setting-password
  a
    font-weight: bold
    color: #3580b9
</style>
