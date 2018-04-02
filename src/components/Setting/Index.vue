<template lang="pug">
div
  h1
    | setting
  div
    h2
      |  プロフィール設定
    p
      | 表示名
      input(v-model="displayName")
    img.setting-user-icon(:src="iconFileId")
    input(type="file" v-on:change="addFile")
    button(v-on:click="submit")
      | 更新
    p(v-if="state === 'successed'")
      | 変更されました
    p(v-if="state === 'failed'")
      | 失敗しました
  div
    h2
      | スタンプ新規登録
    input(type="file" v-on:change="addStampFile")
    input(v-model="stampName")
    button(v-if="stampFile && stampName.length > 0" v-on:click="addStamp")
      | 追加
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'Setting',
  data () {
    return {
      displayName: '',
      icon: null,
      stampFile: null,
      state: 'default',
      stampName: ''
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
      this.state = 'processing'
      const tasks = []
      if (this.icon) {
        tasks.push(client.changeIcon(this.icon))
        this.icon = null
      }
      if (this.$store.state.me.displayName !== this.displayName) {
        tasks.push(client.changeDisplayName(this.displayName))
      }
      Promise.all(tasks).then(() => {
        this.state = 'successed'
        this.$store.dispatch('whoAmI')
      }).catch(e => {
        this.state = 'failed'
      })
    },
    addStamp () {
      client.addStamp(this.stampName, this.stampFile)
      .then(() => {
        this.$store.dispatch('updateStamps')
        this.stampFile = null
        this.stampName = ''
      })
    }
  },
  computed: {
    iconFileId () {
      return `${this.$store.state.baseURL}/api/1.0/files/${this.$store.state.me.iconFileId}`
    }
  },
  mounted () {
    this.displayName = this.$store.state.me.displayName
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
