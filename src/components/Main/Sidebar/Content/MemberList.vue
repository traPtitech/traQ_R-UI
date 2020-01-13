<template lang="pug">
.member-container.is-scroll
  member-group(
    v-for="grade in sortedGrades"
    :key="grade.groupId"
    :filterUnread="isUnreadFiltered"
    :members="grade.members"
    :groupName="grade.name"
    :groupId="grade.groupId"
    :filterText="filterText")
  member-group(
    v-if="bots.length > 0"
    :filterUnread="isUnreadFiltered"
    :members="bots"
    :groupName="'BOT'"
    :filterText="filterText"
    :groupId="'BOT'")
</template>

<script>
import { mapGetters } from 'vuex'
import MemberGroup from '@/components/Main/Sidebar/Content/MemberGroup'

export default {
  name: 'MemberList',
  components: {
    MemberGroup
  },
  methods: {},
  computed: {
    ...mapGetters([
      'sortedGrades',
      'memberData',
      'filterText',
      'isUnreadFiltered'
    ]),
    bots() {
      return this.memberData.filter(user => user.bot).map(user => user.userId)
    }
  }
}
</script>

<style lang="sass">
.member-container
  width: 100%
  color: $text-light-color
  padding:
    top: 50px
    bottom: 20px

.member-empty
  display: flex
  justify-content: center
  padding:
    top: 6px
    right: 12px
    left: 12px
  color: $text-light-color
  opacity: 0.5
</style>
