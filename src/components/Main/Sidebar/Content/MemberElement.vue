<template lang="pug">
<<<<<<< HEAD
div
  div.user-wrap
    img.user-icon(:src="userIconSrc()")
    p
      | {{model.displayName}}@{{model.name}}
=======
div.member-element
  p
    img.member-element-icon(:src="`${$store.state.baseURL}/api/1.0/users/${model.userId}/icon`")
    ruby
      | {{model.displayName}}
      rt
        | @{{model.name}}
>>>>>>> 353f46c9145728e83878875f07867813c534c3b7
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'MemberElement',
  props: {
    model: Object
  },
  methods: {
    userIconSrc () {
      return client.getUserIconUrl(this.model.userId)
    }
  }
}
</script>

<style lang="sass">
<<<<<<< HEAD
.user-wrap
  display: flex

=======
.member-element-icon
  width: 40px
  height: 40px
  background-color: gray
  border-radius: 100%
.member-element > p
  padding-left: 10px
  white-space: nowrap
.member-element > p > ruby
  padding-left: 10px
  display: inline-block
  vertical-align: 40%
>>>>>>> 353f46c9145728e83878875f07867813c534c3b7
</style>
