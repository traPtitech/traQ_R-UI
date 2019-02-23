<template lang="pug">
.stamp-setting
  SettingTitle
    | スタンプ設定
  SettingItem
    SettingItemTitle
      | スタンプ新規登録
    StampEditor
  SettingItem
    SettingItemTitle
      | 登録済みのスタンプ
    SettingDescription
      | 自分の登録したスタンプは編集できます
    .stamp-setting-registerd-stamps-container
      .stamp-setting-registerd-stamp-wrap(
        v-for="stamp in stamps"
        :key="stamp.id"
        :class="{'stamp-editing': showStampEditor(stamp.id)}"
        @click="stampIdToEdit = stamp.id")
        .stamp-setting-registerd-stamp-item
          .stamp-setting-registerd-stamp( 
            :style="stampItemStyle(stamp.fileId)" 
            :title="`:${stamp.name}:`")
          .stamp-setting-registerd-stamp-info
            .stamp-setting-registerd-stamp-name
              | :{{ stamp.name }}:
            .stamp-setting-registerd-stamp-creator
              | by {{ creatorName(stamp.creatorId) }}
        .stamp-editor-wrap(v-if="showStampEditor(stamp.id)")
          .stamp-editor-title
            | スタンプを編集
          StampEditor(:model="stamp")
</template>

<script>
import {mapGetters} from 'vuex'
import client from '@/bin/client'
import StampEditor from '@/components/Setting/StampEditor'
import SettingTitle from '@/components/Setting/SettingTitle'
import SettingItem from '@/components/Setting/SettingItem'
import SettingItemTitle from '@/components/Setting/SettingItemTitle'
import SettingInput from '@/components/Setting/SettingInput'
import SettingFileInput from '@/components/Setting/SettingFileInput'
import SettingButton from '@/components/Setting/SettingButton'
import SettingDescription from '@/components/Setting/SettingDescription'

export default {
  name: 'StampSetting',
  components: {
    StampEditor,
    SettingTitle,
    SettingItem,
    SettingItemTitle,
    SettingInput,
    SettingFileInput,
    SettingButton,
    SettingDescription
  },
  data () {
    return {
      stampFile: null,
      stampName: '',
      stampIdToEdit: ''
    }
  },
  computed: {
    ...mapGetters([
      'fileUrl', 'getMyId'
    ]),
    stamps () {
      return this.$store.state.stampCategolized[0].stamps
    },
    takenStampNames () {
      return this.stamps.map(s => s.name)
    },
    hasNameTaken () {
      return this.takenStampNames.includes(this.stampName)
    },
    canNewStampBeRegistered () {
      return this.stampFile && this.stampName.length > 0 && !this.hasNameTaken
    },
    stampIdsCreatedByMe () {
      return this.stamps.filter(s => s.creatorId === this.getMyId).map(s => s.id)
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
    },
    showStampEditor (stampId) {
      return this.stampIdsCreatedByMe.includes(stampId) && this.stampIdToEdit === stampId
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

.stamp-setting-registerd-stamp-wrap
  &:hover, &.stamp-editing
    background-color: var(--background-hover-color)

.stamp-setting-registerd-stamp
  border-radius: 5px
  background:
    size: contain
    repeat: no-repeat
    position: center
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

.stamp-editor-wrap
  padding: 1rem

.stamp-editor-title
  font-weight: 600
</style>
