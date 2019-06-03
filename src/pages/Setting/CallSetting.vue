<template lang="pug">
.profile-setting
  SettingTitle
    | 通話設定
  SettingItem
    | [TBD]
    // SettingItemTitle
    //   | マイク設定
    // label.open-mode-selector
    //   input(type="checkbox" v-model="initiallyMuted")
    //   | 通話開始時にマイクミュート
    // SettingButton
    //   | 更新
</template>

<script>
import client from '@/bin/client'
import ImageCropper from '@/components/Setting/ImageCropper'
import SettingTitle from '@/components/Setting/SettingTitle'
import SettingInput from '@/components/Setting/SettingInput'
import SettingItem from '@/components/Setting/SettingItem'
import SettingItemTitle from '@/components/Setting/SettingItemTitle'
import SettingButton from '@/components/Setting/SettingButton'
export default {
  name: 'CallSetting',
  components: {
    SettingTitle,
    SettingInput,
    SettingItem,
    SettingItemTitle,
    SettingButton
  },
  data() {
    return {
      initiallyMuted: false
    }
  },
  computed: {},
  methods: {}
}
</script>

<style lang="sass"></style>
