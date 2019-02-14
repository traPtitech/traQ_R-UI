<template lang="pug">
.stamp-setting
  SettingTitle
    | スタンプ設定
  SettingItem
    SettingItemTitle
      | スタンプ新規登録
    input(type="file" @change="addStampFile")
    input(v-model="stampName")
    button(v-if="stampFile && stampName.length > 0" @click="addStamp")
      | 追加
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
    addStampFile (event) {
      this.stampFile = event.target.files[0]
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
  mounted () {
    this.openMode = this.$store.state.openMode
    this.openChannelName = this.$store.getters.getChannelPathById(this.$store.state.openChannelId)
  }
}
</script>

<style lang="sass">
</style>
