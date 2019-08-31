<template lang="pug">
  .setting-input-toggle(:disabled="disabled")
    input.toggle-input(
      :id="`toggle-${_uid}`"
      type="checkbox"
      :checked="value"
      @input="$emit('input', disabled ? value : !value)"
    )
    label.toggle-body(:for="`toggle-${_uid}`")
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class SettingInputToggle extends Vue {
  @Prop({ type: Boolean, required: true })
  value!: boolean

  @Prop({ type: Boolean, default: false })
  disabled!: boolean
}
</script>

<style lang="sass" scoped>
.setting-input-toggle[disabled]
  opacty: 0.5

.toggle-input
  display: none

.toggle-body
  display: flex
  position: relative
  width: 3.6rem
  height: 2rem
  border-radius: 100vw
  transition: background 0.2s ease

  .toggle-input + &
    background: gray

  .toggle-input:checked + &
    background: $primary-color

  &::before
    content: ""
    display: block
    position: absolute
    top: 0.16rem
    left: 0.16rem
    height: 1.6rem
    width: 1.6rem
    border-radius: 100vw
    background: white
    transition: transform 0.2s ease

  .toggle-input:checked + &::before
    transform: translateX(1.6rem)
</style>
