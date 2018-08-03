<template lang="pug">
div.footer
  span.version-text
    | traQ alpha
  ul
    li.menu-button.setting(@click="$router.push('/setting')")
      icon(name="cog")
</template>

<script>
export default {
}
</script>

<style lang="sass">
.footer
  height: $footer-height
  width: 100%
  background: $secondary-color
  display: flex
  align-items: center
  justify-content: space-between
.version-text
  color: white
  font-size: 15px
  margin-left: 20px
</style>
