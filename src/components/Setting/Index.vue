<template lang="pug">
div
  | setting
  div
    p
      |  プロフィール設定
  img.setting-user-icon(:src="`${$store.state.baseURL}/api/1.0/users/${$store.state.me.userId}/icon`")
</template>

<script>
// import client from '@/bin/client'
export default {
  name: 'Setting',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="sass">
.setting-user-icon
  width: 100px
  height: 100px
  background-color: white
  border-radius: 100%
</style>
