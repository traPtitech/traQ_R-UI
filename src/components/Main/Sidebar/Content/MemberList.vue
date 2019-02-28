<template lang="pug">
div.member-container.is-scroll
  div.member-filter-input-wrapper
    filter-input(@inputFilter="filterText = $event")
  member-group(v-for="grade in sortedGrades" :key="grade.groupId" :members="grade.members" :groupName="grade.name" :groupId="grade.groupId" :filterText="filterText")
  member-group(v-if="bots.length > 0" :members="bots" :groupName="'BOT'" :filterText="filterText" :groupId="'BOT'")
</template>

<script>
import { mapGetters } from 'vuex'
import MemberGroup from '@/components/Main/Sidebar/Content/MemberGroup'
import FilterInput from '@/components/Util/FilterInput'

export default {
  name: 'MemberList',
  data () {
    return {
      filterText: ''
    }
  },
  components: {
    MemberGroup,
    FilterInput
  },
  methods: {
  },
  computed: {
    ...mapGetters([
      'sortedGrades', 'memberData'
    ]),
    bots () {
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
    bottom: 20px

.member-filter-input-wrapper
  width: 80%
  padding:
    top: 20px
  margin: auto
</style>
