<template lang="pug">
div
  div.user-wrap
    img.user-icon(:src="userIconSrc()")
    p
      | {{model.displayName}}@{{model.name}}
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
.user-wrap
  display: flex

</style>
