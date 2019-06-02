<template lang="pug">
.profile-setting
  SettingTitle
    | 音声設定
  SettingItem
    SettingItemTitle
      | マイク設定
    label.open-mode-selector
      input(type="checkbox" v-model="initiallyMuted")
      | 通話開始時にマイクミュート
    SettingButton(v-if="isBrowserSettingChanged && isChannelNameValid" @click="updateBrowserSetting")
      | 更新
</template>

<script>
import client from '@/bin/client'
import ImageCropper from '@/components/Setting/ImageCropper'
import SettingTitle from '@/components/Setting/SettingTitle'
import SettingInput from '@/components/Setting/SettingInput'
import SettingFileInput from '@/components/Setting/SettingFileInput'
import SettingButton from '@/components/Setting/SettingButton'
export default {
  name: 'VoiceSetting',
  components: {
    SettingTitle,
    SettingInput,
    SettingFileInput,
    SettingButton
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
}
</script>

<style lang="sass">
</style>
