<template lang="pug">
  .setting-select
    .arrow
      icon-down-direction(color="gray" size="16")
    select.select(@input="$emit('input', $event.target.value)")
      slot
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import IconDownDirection from '@/components/Icon/IconDownDirection.vue'
@Component({
  components: { IconDownDirection }
})
export default class SettingSelect extends Vue {
  @Prop({ type: String, required: true })
  value!: string
}
</script>

<style lang="sass" scoped>

.setting-select
  position: relative
  max-width: 24rem
  height: 3rem

.arrow
  position: absolute
  right: 0.25rem
  top: 0

  display: flex
  align-items: center
  justify-content: center
  height: 100%

  pointer-events: none

.select
  height: 100%
  width: 100%
  padding:
    top: 0.5rem
    bottom: 0.5rem
    left: 0.5rem
    right: 1.25rem
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap

.select:forcus
  border: $border-color

// reset
.select
  outline: none
  text-indent: 0.01px
  text-overflow: ''
  background: none transparent
  vertical-align: middle
  font-size: inherit
  color: inherit
  appearance: button

.select option
  background-color: #fff
  color: #333

.select:-moz-focusring
  color: transparent
  text-shadow: 0 0 0 #828c9a
</style>
