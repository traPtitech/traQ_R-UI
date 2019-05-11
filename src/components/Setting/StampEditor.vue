<template lang="pug">
.stamp-editor
  SettingFileInput.stamp-file-input(
    v-model="rawStampFile"
    :name="model ? `stamp-edit_model.id` : 'stamp-register'"
    :max-size="2 * 1000 * 1000"
    @load="onFileLoad"
    label="ファイルを選択")
  .stamp-preview(v-if="encodedFile")
    ImageCropper(
      v-model="croppedBlob"
      :imageData="encodedFile")
  SettingInput(v-model="stampName" v-if="!model" label="スタンプ名")
  SettingButton(v-if="canPerformOperation" @click="perform")
    | {{ model ? '更新' : '追加' }}
  SettingDescription(v-if="showNameTakenError" warning)
    | このスタンプ名はすでに登録されています
  SettingDescription(v-if="showNameInvalid" warning)
    | スタンプ名は英数字または記号(+-_)の32文字以下からなる必要があります
</template>

<script>
import { mapGetters } from 'vuex'
import client from '@/bin/client'
import ImageCropper from '@/components/Setting/ImageCropper'
import SettingInput from '@/components/Setting/SettingInput'
import SettingFileInput from '@/components/Setting/SettingFileInput'
import SettingButton from '@/components/Setting/SettingButton'
import SettingDescription from '@/components/Setting/SettingDescription'

export default {
  name: 'StampEditor',
  components: {
    ImageCropper,
    SettingInput,
    SettingFileInput,
    SettingButton,
    SettingDescription
  },
  data() {
    return {
      rawStampFile: null,
      stampName: '',
      encodedFile: null, // base64エンコードされた選択中のファイル
      croppedBlob: null // 切り抜かれた画像のBlob
    }
  },
  props: {
    model: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters(['fileUrl', 'getMyId']),
    stampFile() {
      return this.croppedBlob || this.rawStampFile
    },
    stamps() {
      return this.$store.state.stampCategolized[0].stamps
    },
    takenStampNames() {
      return this.stamps.map(s => s.name)
    },
    hasNameTaken() {
      return this.takenStampNames.includes(this.stampName)
    },
    canPerformOperation() {
      // 追加/更新を表示するか
      return (
        (this.model && this.canStampBeUpdated) ||
        (!this.model && this.canNewStampBeRegistered)
      )
    },
    canNewStampBeRegistered() {
      return (
        this.stampFile &&
        this.stampName.length > 0 &&
        !this.hasNameTaken &&
        this.isNameValid
      )
    },
    canStampBeUpdated() {
      return this.stampFile
    },
    stampIdsCreatedByMe() {
      return this.stamps
        .filter(s => s.creatorId === this.getMyId)
        .map(s => s.id)
    },
    showNameTakenError() {
      // 名前が使われてると表示するか
      return (
        this.hasNameTaken && (!this.model || this.stampName !== this.model.name)
      )
    },
    isNameValid() {
      return /^[a-zA-Z0-9+_-]{1,32}$/.test(this.stampName)
    },
    showNameInvalid() {
      return this.stampName.length > 0 && !this.isNameValid
    }
  },
  methods: {
    onFileLoad(dataUrl) {
      this.encodedFile = dataUrl
    },
    async perform() {
      if (this.model) {
        await this.updateStamp()
      } else {
        await this.addStamp()
      }
      this.$store.dispatch('updateStamps')
      this.rawStampFile = null
      this.stampName = ''
      this.encodedFile = null
      this.croppedBlob = null
    },
    async updateStamp() {
      await client.fixStamp(this.model.id, '', this.stampFile)
    },
    async addStamp() {
      await client.addStamp(this.stampName, this.stampFile)
    },
    creatorName(creatorId) {
      return this.$store.state.memberMap[creatorId].name
    },
    showStampEditor(stampId) {
      return (
        this.stampIdsCreatedByMe.includes(stampId) &&
        this.stampIdToEdit === stampId
      )
    }
  },
  mounted() {
    this.openMode = this.$store.state.openMode
    this.openChannelName = this.$store.getters.getChannelPathById(
      this.$store.state.openChannelId
    )
  }
}
</script>

<style lang="sass">
.stamp-preview
  margin-bottom: 1rem
</style>
