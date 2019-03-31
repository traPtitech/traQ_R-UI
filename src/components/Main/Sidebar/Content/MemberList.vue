<template lang="pug">
.member-container.is-scroll
  .member-filter-input-wrapper
    .member-list-filter-input-wrapper
      filter-input(v-model="filterText" :useDebounce="true")
    .member-list-toggle-button-wrapper
      toggle-button(v-model="isUnreadFiltered")
        img(src="@/assets/img/icon/unread.svg")
  member-group(
    v-for="grade in sortedGrades"
    :key="grade.groupId"
    :filterUnread="isUnreadFiltered"
    :members="grade.members"
    :groupName="grade.name"
    :groupId="grade.groupId"
    :filterText="filterText")
  member-group(
    v-if="bots.length > 0 && !isUnreadFiltered"
    :members="bots"
    :groupName="'BOT'"
    :filterText="filterText"
    :groupId="'BOT'")
</template>

<script>
import { mapGetters } from 'vuex'
import MemberGroup from '@/components/Main/Sidebar/Content/MemberGroup'
import FilterInput from '@/components/Util/FilterInput'
import ToggleButton from '@/components/Util/ToggleButton'

export default {
  name: 'MemberList',
  data() {
    return {
      filterText: '',
      isUnreadFiltered: false
    }
  },
  components: {
    MemberGroup,
    FilterInput,
    ToggleButton
  },
  methods: {},
  computed: {
    ...mapGetters(['sortedGrades', 'memberData']),
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
    bottom: 20px

.member-filter-input-wrapper
  display: flex
  width: 80%
  padding:
    top: 20px
  margin: auto

.member-list-filter-input-wrapper
  width: calc(100% - 38px)

.member-list-toggle-button-wrapper
  margin:
    left: 6px

  img
    width: 55%
    margin:
      left: 4px
      bottom: 2px

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
