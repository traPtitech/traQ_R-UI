<template lang="pug">
div
  MemberElement(v-for="member in $store.state.memberData" :model="member" :key="member.userId")
</template>

<script>
import MemberElement from '@/components/Main/Sidebar/Content/MemberElement'
export default {
  name: 'MemberList',
  components: {
    'MemberElement': MemberElement
  }
}
</script>

<style lang="sass">
</style>
