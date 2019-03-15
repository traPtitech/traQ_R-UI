<template lang="pug">
.clip-list
  .clip-list-under-construction(title="あのねあのね！")
    IconLandscapeUnderConstruction(size="128")
    .clip-list-under-construction-text
      | この先まだ工事中なんです
</template>

<script>
import IconLandscapeUnderConstruction from '@/components/Icon/IconLandscapeUnderConstruction'
export default {
  name: 'ClipList',
  components: {
    IconLandscapeUnderConstruction
  }
}
</script>

<style lang="sass">
.clip-list-under-construction
  display: flex
  flex-direction: column
  align-items: center
  color: white
  padding-top: 5rem
  user-select: none
  opacity: 0.5
.clip-list-under-construction-text
  padding: 0 1rem
  margin-top: 1rem
  text-align: center
</style>
