<template lang="pug">
div.member-element
  p
    img.member-element-icon(:src="`${$store.state.baseURL}/api/1.0/users/${model.userId}/icon`")
    ruby
      | {{model.displayName}}
      rt
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
.member-element-icon
  width: 40px
  height: 40px
  background-color: gray
  border-radius: 100%
.member-element > p
  padding-left: 10%
.member-element > p > ruby
  padding-left: 5%
  display: inline-block
  vertical-align: 40%
</style>
