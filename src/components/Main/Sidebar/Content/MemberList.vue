<template lang="pug">
div.member-container
  div.grade-container(v-for="tag in tags" v-if="tag.users.length > 0" :class="`${gradeMap[tag.tag[2]]} ${tag.tag.substr(0, 2)}`" :style="`border-color: ${color(tag.tag)};`")
    div.grade-name-container(:style="`background-color: ${color(tag.tag)};`")
      p
        | {{tag.tag}}
    MemberElement(v-for="member in tag.users" :model="member" :key="member.userId")
  div.grade-container(v-if="bots.length > 0" :class="``" :style="`border-color: gray;`")
    div.grade-name-container(:style="`background-color: gray;`")
      p
        | BOT
    MemberElement(v-for="member in bots" :model="member" :key="member.userId")
</template>

<script>
import MemberElement from '@/components/Main/Sidebar/Content/MemberElement'
export default {
  name: 'MemberList',
  data () {
    return {
      gradeMap: {
        B: 'bachelor',
        M: 'master',
        D: 'doctor'
      }
    }
  },
  components: {
    'MemberElement': MemberElement
  },
  methods: {
    color (grade) {
      const num = parseInt(grade.substr(0, 2), 10)
      return this.colors[num][grade[2]]
    }
  },
  computed: {
    tags () {
      const grades = this.$store.state.tagData.filter(tag => tag.tag !== '' && tag.tag.replace(/\d\d[B|M|D]/, '') === '')
      const map = {
        B: 0,
        M: 1,
        D: 2
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
          M: `hsl(${(i * 100 + 33) % 360}, 50%, 50%)`,
          D: `hsl(${(i * 100 + 66) % 360}, 50%, 50%)`
        }
      }
      return ret
    },
    bots () {
      return this.$store.state.memberData.filter(user => user.bot && !/#/.test(user.name))
    }
  }
}
</script>

<style lang="sass">
.member-container
  width: 100%
  height: 100%
.grade-container
  text-align: left
  border-left: 8px solid
.grade-container > p
  padding: 5px 10px
.grade-name-container
  width: 80%
  margin-left: 10px
.grade-name-container > p
  color: white
  margin-left: 10px
</style>
