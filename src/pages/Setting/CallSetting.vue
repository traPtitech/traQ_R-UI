<template lang="pug">
.call-setting
  setting-title
    | 通話設定
  setting-item-columned
    template(#left)
      setting-item-title
        | RTC機能を有効にする (β)
    template(#right)
      setting-input-toggle(
        :value="$store.state.rtc.isRtcEnabled"
        @input="$store.dispatch('rtc/updateIsRtcEnabled', $event)"
      )
    template(#note)
      setting-description
        | 通話などのリアルタイムコミュニケーション機能を有効化します
        br
        | マイクなどへのアクセス許可が必要です
  template(v-if="enabled")
    setting-item
      setting-item-title
        | 入力デバイス
      setting-select(
        v-if="!deviceFerchFailed && audioInputDevices.length > 0"
        :value="$store.state.rtc.audioInputDeviceId"
        @input="$store.dispatch('rtc/updateAudioInputDeviceId', $event)"
      )
        option(v-for="device in audioInputDevices" :key="device.deviceId" :value="device.deviceId")
          | {{ device.label }}
      setting-description(v-else)
        | デバイスが取得できませんでした
    setting-item
      // setting-item-title
      //   | 出力デバイス
      // setting-select(
      //   v-if="!deviceFerchFailed"
      //   :value="$store.state.rtc.audioOutputDeviceId"
      //   @input="$store.dispatch('rtc/updateAudioOutputDeviceId', $event)"
      // )
      //   option( v-for="device in audioOutputDevices" :key="device.deviceId" :value="device.deviceId")
      //     | {{ device.label }}
      // setting-description(v-else)
      //   | デバイスが取得できませんでした

</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import client from '@/bin/client'
import ImageCropper from '@/components/Setting/ImageCropper.vue'
import SettingTitle from '@/components/Setting/SettingTitle.vue'
import SettingInput from '@/components/Setting/SettingInput.vue'
import SettingInputToggle from '@/components/Setting/SettingInputToggle.vue'
import SettingSelect from '@/components/Setting/SettingSelect.vue'
import SettingItem from '@/components/Setting/SettingItem.vue'
import SettingItemColumned from '@/components/Setting/SettingItemColumned.vue'
import SettingItemTitle from '@/components/Setting/SettingItemTitle.vue'
import SettingButton from '@/components/Setting/SettingButton.vue'
import SettingDescription from '@/components/Setting/SettingDescription.vue'

@Component({
  components: {
    SettingTitle,
    SettingInput,
    SettingInputToggle,
    SettingItem,
    SettingItemColumned,
    SettingSelect,
    SettingItemTitle,
    SettingButton,
    SettingDescription
  }
})
export default class CallSetting extends Vue {
  private devices: MediaDeviceInfo[] = []
  private deviceFerchFailed = false

  mounted() {
    if (this.enabled) {
      this.updateDeviceList()
    }
  }

  async updateDeviceList() {
    try {
      this.devices = await navigator.mediaDevices.enumerateDevices()
    } catch (e) {
      this.deviceFerchFailed = true
    }
    if (this.devices.length === 0 || this.devices[0].label === '') {
      this.deviceFerchFailed = true
    }
  }

  @Watch('enabled')
  async onEnabledChange(val: boolean) {
    if (val) {
      // offからonになったときは許可を求める
      await navigator.mediaDevices.getUserMedia({ audio: true })
      this.updateDeviceList()
    }
  }

  get enabled() {
    return this.$store.state.rtc.isRtcEnabled
  }

  get audioInputDeviceId() {
    return this.$store.state.rtc.audioInputDeviceId
  }

  get audioInputDevices() {
    return this.devices.filter(d => d.kind === 'audioinput')
  }
  get audioOutputDevices() {
    return this.devices.filter(d => d.kind === 'audiooutput')
  }
  get videoinputDevices() {
    return this.devices.filter(d => d.kind === 'videoinput')
  }
}
</script>

<style lang="sass"></style>
