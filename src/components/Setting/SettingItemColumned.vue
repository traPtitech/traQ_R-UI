<template lang="pug" functional>
  .setting-item
    .setting-item-columned
      .setting-item__column-left
        slot(name="left")
      .setting-item__column-right
        slot(name="right")
    .setting-item-columned-note
        slot(name="note")
</template>

<script>
export default {}
</script>

<style lang="sass">
.setting-item
  margin:
    top: 1rem
    bottom: 2rem
.setting-item-columned
  display: flex
  align-items: center
  justify-content: space-between
.setting-item__column-right
  margin-left: 1rem
</style>
