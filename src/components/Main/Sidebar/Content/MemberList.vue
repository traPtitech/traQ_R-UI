<template lang="pug">
div.member-container.is-scroll
  div.member-filter-input-wrapper
    FilterInput(@inputFilter="filterText = $event")
  MemberGroup(v-for="grade in sortedGrades" :key="grade.tag" :members="grade.users" :groupName="grade.tag" :filterText="filterText")
  MemberGroup(v-if="bots.length > 0" :members="bots" :groupName="'BOT'" :filterText="filterText")
</template>

<script>
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
    sortedGrades () {
      const map = {
        B: 0,
        M: 1,
        D: 2,
        R: 3
      }
      const f = (s) => {
        return map[s[2]] * 100 + parseInt(s.substr(0, 2), 10)
      }
      return this.grades
        .sort((lhs, rhs) => {
          return f(lhs.tag) - f(rhs.tag)
        })
    },
    grades () {
      const grades = this.$store.state.tagData
        .filter(
            tag => tag.tag !== '' && /^\d{2}[BMDR]$/.test(tag.tag)
          )
        .filter(
            tag => tag.users.length > 0
          )
      return grades
    },
    bots () {
      return this.$store.state.memberData.filter(user => user.bot)
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
