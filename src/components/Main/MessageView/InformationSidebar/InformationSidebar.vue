<template lang="pug">
div.information-sidebar
    | {{onlineUsersNumber}}
</template>

<script>
export default {
  name: 'InformationSidebar',
  computed: {
    onlineUsersNumber () {
      return this.$store.state.heartbeatStatus.userStatuses.length
    },
    onlineUsers () {
      return this.$store.state.heartbeatStatus.userStatuses
    },
    hoge () {
      return this.$store.state.heartbeatStatus
    }
  }
}
</script>

<style lang="sass">
.information-sidebar
  position: fixed
  z-index: $online-users-box-index
  +mq(pc)
    right: 0
    top: 0
    width: $online-users-box-width
    height: 60px
  +mq(sp)
    right: 0
    // top: 10px
    width: $online-users-box-width
    height: 50px
  cursor: pointer
  user-select: none
  transition: all .3s
  box-shadow: 0 0 0
</style>

