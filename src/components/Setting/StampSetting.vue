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
        @click="closeAction(stamp.id)")
        .stamp-setting-registerd-stamp-item
          .stamp-setting-registerd-stamp( 
            :style="stampItemStyle(stamp.fileId)" 
            :title="`:${stamp.name}:`")
          .stamp-setting-registerd-stamp-info
            .stamp-setting-registerd-stamp-name
              | :{{ stamp.name }}:
            .stamp-setting-registerd-stamp-creator
              | by {{ creatorName(stamp.creatorId) }}
          .stamp-setting-registerd-stamp-action-icon(v-if="isStampCreatedByMe(stamp.id)")
            .stamp-action-icon(@click="toggleEdit(stamp.id)")
              IconEdit(color="var(--text-color)" :size="18")
            // .stamp-action-icon(@click="toggleDelete(stamp.id)")
            //   IconClose(color="var(--text-color)" :size="18")
        .stamp-action-container(v-if="showStampEditor(stamp.id)")
          .stamp-editor-wrap(v-if="stampAction === 'edit'")
            .stamp-editor-title
              | スタンプを編集
            StampEditor(:model="stamp")
          .stamp-editor-wrap(v-if="stampAction === 'delete'")
            .stamp-editor-title
              | スタンプを削除しますか？
            SettingButton.stamp-delete-button(@click="deleteStamp(stamp.id)")
              | 削除する
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
import IconClose from '@/components/Icon/IconClose.vue'
import IconEdit from '@/components/Icon/IconEdit.vue'

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
    SettingDescription,
    IconClose,
    IconEdit
  },
  data () {
    return {
      stampFile: null,
      stampName: '',
      stampIdToEdit: '',
      stampAction: ''
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
    async addStamp () {
      await client.addStamp(this.stampName, this.stampFile)
      this.stampFile = null
      this.stampName = ''
      this.$store.dispatch('updateStamps')
    },
    async deleteStamp (stampId) {
      await client.deleteStamp(stampId)
      this.$store.dispatch('updateStamps')
    },
    stampItemStyle (fileId) {
      return `background-image: url(${this.fileUrl(fileId)})`
    },
    creatorName (creatorId) {
      return this.$store.state.memberMap[creatorId].name
    },
    isStampCreatedByMe (stampId) {
      return this.stampIdsCreatedByMe.includes(stampId)
    },
    showStampEditor (stampId) {
      return this.isStampCreatedByMe(stampId) && this.stampIdToEdit === stampId && this.stampAction
    },
    toggleEdit (stampId) {
      this.stampIdToEdit = stampId
      this.stampAction = 'edit'
    },
    toggleDelete (stampId) {
      this.stampIdToEdit = stampId
      this.stampAction = 'delete'
    },
    closeAction (stampId) {
      if (stampId === this.stampIdToEdit) return
      this.stampIdToEdit = ''
      this.stampAction = ''
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

.stamp-editor-title
  font-weight: 600

.stamp-action-container
  padding: 1rem

.stamp-action-icon
  cursor: pointer
  margin: 0 0.5rem
  opacity: 0.3
  &:hover
    opacity: 1

.stamp-setting-registerd-stamp-action-icon
  margin-left: auto
  display: flex

.stamp-delete-button
  margin: 1rem 0

</style>
