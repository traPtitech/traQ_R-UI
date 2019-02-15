<template lang="pug">
.stamp-setting
  SettingTitle
    | スタンプ設定
  SettingItem
    SettingItemTitle
      | スタンプ新規登録
    SettingFileInput.stamp-file-input(v-model="stampFile" name="stamp" label="ファイルを選択")
    SettingInput(v-model="stampName" label="スタンプ名")
    SettingButton(v-if="stampFile && stampName.length > 0" @click="addStamp")
      | 追加
</template>

<script>
import client from '@/bin/client'
import SettingTitle from '@/components/Setting/SettingTitle'
import SettingItem from '@/components/Setting/SettingItem'
import SettingItemTitle from '@/components/Setting/SettingItemTitle'
import SettingInput from '@/components/Setting/SettingInput'
import SettingFileInput from '@/components/Setting/SettingFileInput'
import SettingButton from '@/components/Setting/SettingButton'
export default {
  name: 'ProfileSetting',
  components: {
    SettingTitle,
    SettingItem,
    SettingItemTitle,
    SettingInput,
    SettingFileInput,
    SettingButton
  },
  data () {
    return {
      stampFile: null,
      stampName: ''
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
    addStamp () {
      client.addStamp(this.stampName, this.stampFile)
      .then(() => {
        this.$store.dispatch('updateStamps')
        this.stampFile = null
        this.stampName = ''
      })
    }
  },
  mounted () {
    this.openMode = this.$store.state.openMode
    this.openChannelName = this.$store.getters.getChannelPathById(this.$store.state.openChannelId)
  }
}
</script>

<style lang="sass">
.stamp-file-input
  margin:
    top: 1rem
    bottom: 2rem
</style>
