<template lang="pug">
base-common-modal(:title="`TAG: ${data.tag}`"
                  :enable-back="!!$store.state.modal.lastUser"
                  small)
  .tag-modal-go-back(v-if="$store.state.modal.lastUser"
                     slot="header-icon"
                     @click="backToUserModal")
    icon-back(color="var(--primary-color-on-bg)" size="16")
  icon-tag(v-else color="var(--primary-color-on-bg)" slot="header-icon" size="24")
  .tag-modal
    .tag-user-list
      member-element.tag-user-element(v-for="member in users" :model="member" :key="member.userId" backgroundColor="var(--background-color)")
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import MemberElement from '@/components/Main/Sidebar/Content/MemberElement'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import IconTag from '@/components/Icon/IconTag'
import IconBack from '@/components/Icon/IconBack'

export default {
  name: 'TagModal',
  components: {
    BaseCommonModal,
    MemberElement,
    IconTag,
    IconBack
  },
  methods: {
    closeModal() {
      this.$store.dispatch('modal/close')
    },
    backToUserModal() {
      this.$store.dispatch(
        'openUserModal',
        this.$store.state.modal.lastUser.userId
      )
    }
  },
  computed: {
    ...mapState('modal', ['data']),
    ...mapGetters('modal', {
      userIds: 'currentTagUsersSorted'
    }),
    ...mapState(['memberMap']),
    users() {
      return this.$store.getters
        .sortByUserId(this.userIds)
        .filter(
          userId =>
            this.memberMap[userId] && this.memberMap[userId].accountStatus !== 0
        )
        .map(userId => this.memberMap[userId])
    }
  }
}
</script>

<style lang="sass">
.tag-modal-description
  max-width: calc(80vw - 4rem)
  font-size: 1.3rem
  margin: 1rem 2rem 0.5rem 2rem
  overflow-wrap: break-word
.tag-user-list
  max-height: 50vh
  overflow-y: scroll
  border: 1px solid #eeeeee
  background-color: $background-color
  -webkit-overflow-scrolloing: touch
.tag-modal-go-back
  cursor: pointer
</style>
