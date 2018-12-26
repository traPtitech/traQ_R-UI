<template lang="pug">
div.member-container
  MemberGroup(v-for="tag in tags" :key="tag.tag" :members="tag.users" :groupName="tag.tag")
  MemberGroup(v-if="bots.length > 0" :members="bots" :groupName="'BOT'")
</template>

<script>
import MemberGroup from '@/components/Main/Sidebar/Content/MemberGroup'
export default {
  name: 'MemberList',
  components: {
    MemberGroup
  },
  methods: {
    color (grade) {
      const num = parseInt(grade.substr(0, 2), 10)
      return this.colors[num][grade[2]]
    }
  },
  computed: {
    tags () {
      const grades = this.$store.state.tagData
        .filter(
            tag => tag.tag !== '' && /^\d{2}[BMDR]$/.test(tag.tag)
          )
        .filter(
            tag => tag.users.length > 0
          )
      const map = {
        B: 0,
        M: 1,
        D: 2,
        R: 3
      }
      const f = (s) => {
        return map[s[2]] * 100 + parseInt(s.substr(0, 2), 10)
      }
      grades.sort((lhs, rhs) => {
        return f(lhs.tag) - f(rhs.tag)
      })
      return grades
    },
    colors () {
      const ret = new Array(100)
      for (let i = 0; i < 100; i++) {
        ret[i] = {
          B: `hsl(${(i * 100) % 360}, 50%, 50%)`,
          M: `hsl(${(i * 100 + 25) % 360}, 50%, 50%)`,
          D: `hsl(${(i * 100 + 50) % 360}, 50%, 50%)`,
          R: `hsl(${(i * 100 + 75) % 360}, 50%, 50%)`
        }
      }
      return ret
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
  height: 100%
  color: $text-light-color
</style>
