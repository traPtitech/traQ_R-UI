<template lang="pug">
.user-modal-groups
  .user-modal-groups-container.is-scroll
    .user-modal-group-element(v-for="(group, index) in groups" :key="group.groupId")
      .user-modal-icon--gray.user-modal-group-icon
        IconProfileFill(size="16" color="gray")
      .user-modal-group-body(@click="openGroupModal(group)")
        | {{group.name}}
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import IconProfileFill from '@/components/Icon/IconProfileFill'
import IconPlus from '@/components/Icon/IconPlus'
import IconClose from '@/components/Icon/IconClose'
import IconLocked from '@/components/Icon/IconLocked'
import IconUnlocked from '@/components/Icon/IconUnlocked'

export default {
  name: 'UserModalGroups',
  components: {
    IconProfileFill,
    IconPlus,
    IconClose,
    IconLocked,
    IconUnlocked
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('modal', ['data']),
    ...mapGetters('modal', {
      groups: 'currentUserGroupsSorted'
    })
  },
  methods: {
    openGroupModal(group) {
      this.$store.dispatch('modal/openGroupModal', group.groupId)
    }
  }
}
</script>

<style lang="sass">
$input-height: 3rem

.user-modal-groups
  display: flex
  flex-direction: column
  width: 100%

.user-modal-groups-container
  min-height: 0
  overflow-y: scroll
  flex: 1

.user-modal-group-element
  $gap: 1rem
  display: grid
  grid-template-columns: 2rem 1fr
  grid-gap: $gap
  +mq(pc)
    padding: 0.8rem 2.5rem
  +mq(sp)
    padding: 0.6rem 2rem
  &:first-child
    margin-top: 1rem
  &:last-child
    margin-bottom: 1rem
  &:hover
    background: $background-hover-color

  .user-modal-group-icon
    display: flex
    align-items: center
    height: 100%

  .user-modal-group-body
    flex: auto
    word-wrap: break-word
    cursor: pointer
</style>
