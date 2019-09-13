<template lang="pug">
  .information-sidebar-qalling-display(:class="displayClass")
    .indicator-container
      talking-indicator.indicator(
        :user="$store.state.me"
        :mic-muted="$store.state.rtc.isMicMuted"
      )
      talking-indicator.indicator(
        v-for="state in callingUserStates"
        :key="state.userId"
        :user="$store.state.memberMap[state.userId]"
        :mic-muted="state.state.includes('micmuted')"
      )
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TalkingIndicator from '@/components/Molecules/TalkingIndicator.vue'

@Component({
  components: {
    TalkingIndicator
  }
})
export default class InformationSidebarQallingDisplay extends Vue {
  get callingUserStates() {
    return this.$store.getters['rtc/currentChannelCallingUserStates']
  }

  get displayClass() {
    return {
      'more-sp': this.callingUserStates.length > 4,
      'more-pc': this.callingUserStates.length > 7
    }
  }
}
</script>

<style lang="sass" scoped>
@mixin more-hider
  content: ""
  display: block
  position: absolute
  height: 20px
  bottom: 0
  width: 100%
  background-image: linear-gradient(to bottom, transparent, #094587)

.information-sidebar-qalling-display
  padding-bottom: 0.25rem
  &::before
    content: ""
    display: block
    margin: 0 5px
    height: 1px
    width: calc(100% - 10px)
    background: rgba(255, 255, 255, 0.5)

.more-pc
  &::after
    @include more-hider

.more-sp
  +mq(sp)
    &::after
      @include more-hider

.indicator-container
  max-height: 300px
  +mq(sp)
    max-height: 190px
  -webkit-overflow-scrolling: touch
  overflow-y: scroll
.indicator
  margin: 0.5rem auto
</style>
