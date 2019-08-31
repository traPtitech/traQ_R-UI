<template lang="pug">
  .information-sidebar-content-item
    .information-sidebar-content-header
      icon-call(size="24")
      span
        | QALL
      .indormation-sidebar-topic-edit-button(
        v-if="$store.getters['rtc/isCallingOnCurrentChannel']"
        :class="{ 'information-sidebar-action-cancel': isAdjustingCallVolumes }"
        :title="isAdjustingCallVolumes ? '音量を調整する' : 'キャンセル'"
        @click="toggleCallVolumeAdjust"
      )
        icon-check(v-if="isAdjustingCallVolumes")
        icon-volume(v-else)
    .information-sidebar-content-body
      .information-sidebar-call-item(
        v-if="$store.getters['rtc/isCallingOnCurrentChannel']"
        :style="{ opacity: isAdjustingCallVolumes ? 0.5 : 1 }"
      )
        calling-member-element(
          :member="$store.state.me"
          :adjust-volume="false"
          :mic-muted="$store.state.rtc.isMicMuted"
        )
      .information-sidebar-call-item(v-for="state in callingUserStates")
        calling-member-element(
          :member="$store.state.memberMap[state.userId]"
          :adjust-volume="isAdjustingCallVolumes"
          :mic-muted="state.state.includes('micmuted')"
          :talking="userIdTalkingMap[state.userId]"
        )
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { talkingThreshould } from '@/lib/rtc/AudioStreamMixer'
import IconVolume from '@/components/Icon/IconVolume.vue'
import IconCall from '@/components/Icon/IconCall.vue'
import IconCheck from '@/components/Icon/IconCheck.vue'
import CallingMemberElement from '@/components/Main/Rtc/CallingMemberElement.vue'
import { WebRTCUserState } from 'traq-api'

@Component({
  components: {
    IconVolume,
    IconCall,
    IconCheck,
    CallingMemberElement
  }
})
export default class InformationSideBarQall extends Vue {
  private isAdjustingCallVolumes = false
  private userIdTalkingMap: Record<string, boolean> = {}
  private indicatorAnimationFrameRequestId = 0

  mounted() {
    this.updateIndicators()
  }

  beforeDestroy() {
    cancelAnimationFrame(this.indicatorAnimationFrameRequestId)
  }

  updateIsTalking(state: WebRTCUserState) {
    if (!state.userId) {
      return
    }
    const talking =
      this.$store.state.rtc.mixer.getLevelOf(state.userId) > talkingThreshould
    this.$set(this.userIdTalkingMap, state.userId, talking)
  }

  updateIndicators() {
    if (
      !this.$store.state.rtc.mixer ||
      !this.$store.getters['rtc/isCallingOnCurrentChannel']
    ) {
      return
    }
    this.$store.getters['rtc/currentChannelCallingUserStates'].forEach(
      this.updateIsTalking
    )

    this.indicatorAnimationFrameRequestId = requestAnimationFrame(
      this.updateIndicators
    )
  }

  toggleCallVolumeAdjust() {
    this.isAdjustingCallVolumes = !this.isAdjustingCallVolumes
  }

  get callingUserStates() {
    return this.$store.getters['rtc/currentChannelCallingUserStates']
  }
}
</script>

<style lang="sass" scoped></style>
