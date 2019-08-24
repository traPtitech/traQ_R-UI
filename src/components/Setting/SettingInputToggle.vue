<template lang="pug">
  .setting-input-toggle
    input.toggle-input(:id="`toggle-${_uid}`" type="checkbox" :checked="value" @input="$emit('input', !value)")
    label.toggle-body(:for="`toggle-${_uid}`")
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
@Component
export default class SettingInputToggle extends Vue {
  @Prop({ type: Boolean, required: true })
  value!: boolean
}
</script>

<style lang="sass" scoped>
.toggle-input
  display: none

.toggle-body
  display: flex
  position: relative
  width: 3.8rem
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
    top: 0.2rem
    left: 0.2rem
    height: 1.6rem
    width: 1.6rem
    border-radius: 100vw
    background: white
    transition: transform 0.2s ease

  .toggle-input:checked + &::before
    transform: translateX(1.8rem)
</style>
