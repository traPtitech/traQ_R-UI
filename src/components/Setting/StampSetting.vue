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
  SettingItem
    SettingItemTitle
      | 登録済みのスタンプ
    .stamp-setting-registerd-stamps-container
      .stamp-setting-registerd-stamp-wrap(v-for="stamp in stamps")
        .stamp-setting-registerd-stamp-item
          .stamp-setting-registerd-stamp( 
            :style="stampItemStyle(stamp.fileId)" 
            :title="`:${stamp.name}:`")
          .stamp-setting-registerd-stamp-info
            .stamp-setting-registerd-stamp-name
              | :{{ stamp.name }}:
            .stamp-setting-registerd-stamp-creator
              | by {{ creatorName(stamp.creatorId) }}
</template>

<script>
import {mapGetters} from 'vuex'
import client from '@/bin/client'
import SettingTitle from '@/components/Setting/SettingTitle'
import SettingItem from '@/components/Setting/SettingItem'
import SettingItemTitle from '@/components/Setting/SettingItemTitle'
import SettingInput from '@/components/Setting/SettingInput'
import SettingFileInput from '@/components/Setting/SettingFileInput'
import SettingButton from '@/components/Setting/SettingButton'

export default {
  name: 'StampSetting',
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
    ...mapGetters([
      'fileUrl'
    ]),
    stamps () {
      return this.$store.state.stampCategolized[0].stamps
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
    },
    stampItemStyle (fileId) {
      return `background-image: url(${this.fileUrl(fileId)})`
    },
    creatorName (creatorId) {
      return this.$store.state.memberMap[creatorId].name
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

.stamp-setting-registerd-stamp-item
  display: flex
  align-items: center
  padding: 8px

.stamp-setting-registerd-stamp-info
  margin-left: 8px

.stamp-setting-registerd-stamps-container
//   display: flex
//   flex-wrap: wrap

.stamp-setting-registerd-stamp-wrap
  &:hover
    background-color: var(--background-hover-color)

.stamp-setting-registerd-stamp
  border-radius: 5px
  background:
    size: contain
  width: 48px
  height: 48px

.stamp-setting-registerd-stamp-name
  font:
    weight: 600
    size: 0.9rem

.stamp-setting-registerd-stamp-creator
  opacity: 0.7
  font:
    weight: 200
    size: 0.8rem
</style>
