<template lang="pug">
.stamp-editor
  SettingFileInput.stamp-file-input(v-model="stampFile" :name="model ? `stamp-edit_model.id` : 'stamp-register'" label="ファイルを選択")
  SettingInput(v-model="stampName" v-if="!model" label="スタンプ名")
  SettingButton(v-if="canPerformOperation" @click="perform")
    | {{ model ? '更新' : '追加' }}
  SettingDescription(v-if="showNameTakenError" warning)
    | このスタンプ名はすでに登録されています
</template>

<script>
import {mapGetters} from 'vuex'
import client from '@/bin/client'
import SettingInput from '@/components/Setting/SettingInput'
import SettingFileInput from '@/components/Setting/SettingFileInput'
import SettingButton from '@/components/Setting/SettingButton'
import SettingDescription from '@/components/Setting/SettingDescription'

export default {
  name: 'StampEditor',
  components: {
    SettingInput,
    SettingFileInput,
    SettingButton,
    SettingDescription
  },
  data () {
    return {
      stampFile: null,
      stampName: ''
    }
  },
  props: {
    model: {
      type: Object,
      default: null
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
    canPerformOperation () {
      // 追加/更新を表示するか
      return (this.model && this.canStampBeUpdated) ||
        (!this.model && this.canNewStampBeRegistered)
    },
    canNewStampBeRegistered () {
      return this.stampFile && this.stampName.length > 0 && !this.hasNameTaken
    },
    canStampBeUpdated () {
      return !!this.stampFile
    },
    stampIdsCreatedByMe () {
      return this.stamps.filter(s => s.creatorId === this.getMyId).map(s => s.id)
    },
    showNameTakenError () {
      // 名前が使われてると表示するか
      return this.hasNameTaken && (!this.model || this.stampName !== this.model.name)
    }
  },
  methods: {
    perform () {
      if (this.model) {
        this.updateStamp()
      } else {
        this.addStamp()
      }
    },
    updateStamp () {
      client.fixStamp(this.model.id, '', this.stampFile)
      .then(() => {
        this.$store.dispatch('updateStamps')
        this.stampFile = null
        this.stampName = ''
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
</style>
