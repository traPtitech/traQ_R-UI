<template lang="pug">
div
  div.list-user-icon-wrap
    img.list-user-icon(:src="`${$store.state.baseURL}/api/1.0/files/${model.iconFileId}`")
  p.list-user-name
    | @{{model.name}}
</template>

<script>
export default {
  name: 'MemberElement',
  props: {
    model: Object
  }
}
</script>

<style lang="sass">
.list-user-icon
  width: 40px
  height: 40px
  background-color: gray
  border-radius: 100%
.list-user-name
  margin: 0 0 0 10px
  font-weight: bold
</style>
