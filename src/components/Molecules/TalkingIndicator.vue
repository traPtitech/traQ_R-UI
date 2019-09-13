<template lang="pug">
  .talking-indicator
    .talking-indicator__indicator(v-if="talking")
    user-icon.talking-indicator__icon(:user="user" :size="30")
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { talkingThreshould } from '@/lib/rtc/AudioStreamMixer'
import { User, WebRTCUserState } from 'traq-api'
import UserIcon from '@/components/Atoms/UserIcon.vue'

@Component({
  components: {
    UserIcon
  }
})
export default class TalkingIndicator extends Vue {
  private talking = false
  private indicatorAnimationFrameRequestId = 0

  @Prop({ type: Object, required: true })
  private user!: User

  @Prop({ type: Boolean, required: true })
  private micMuted!: boolean

  mounted() {
    this.updateIsTalking()
  }

  beforeDestroy() {
    cancelAnimationFrame(this.indicatorAnimationFrameRequestId)
  }

  updateIsTalking() {
    if (
      !this.$store.state.rtc.mixer ||
      !this.$store.getters['rtc/isCallingOnCurrentChannel'] ||
      !this.user.userId
    ) {
      return
    }
    if (!this.micMuted) {
      this.talking =
        this.$store.state.rtc.mixer.getLevelOf(this.user.userId) >
        talkingThreshould
    }
    this.indicatorAnimationFrameRequestId = requestAnimationFrame(
      this.updateIsTalking
    )
  }
}
</script>

<style lang="sass">
$indicator-size: 2px

.talking-indicator
  position: relative
  width: 30px + $indicator-size * 2
  height: 30px + $indicator-size * 2

.talking-indicator__indicator
  position: absolute
  top: -$indicator-size
  left: -$indicator-size

  background-color: $online-color
  border-radius: 100vw

  width: 30px + $indicator-size * 2
  height: 30px + $indicator-size * 2

.talking-indicator__icon
  position: absolute
  background: $tertiary-color
</style>
