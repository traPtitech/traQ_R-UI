<template lang="pug">
  .information-sidebar-qalling-display
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
}
</script>

<style lang="sass" scoped>
.information-sidebar-qalling-display
  display: flex
  flex-flow: column nowrap
  align-items: center
  border-top: 1px solid rgba(255, 255, 255, 0.5)
  margin: 0 5px;
  padding-top: 0.5rem
  padding-bottom: 0.25rem
.indicator
  margin: 0.25rem 0
</style>
