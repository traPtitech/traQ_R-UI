<template functional>
  <p class="setting-description" :class="{'setting-warning': props.warning}">
    <slot></slot>
  </p>
</template>

<script>
export default {
  name: 'SettingDescription',
  props: {
    warning: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="sass">
.setting-description
  font-size: 0.9rem
  margin: 0.5rem 0
.setting-warning
  color: $default-warning-color
</style>
