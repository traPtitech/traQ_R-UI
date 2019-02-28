<template lang="pug">
base-common-modal(:title="`GROUP: ${data.name}`"
                  :enable-back="!!$store.state.modal.lastUser"
                  small)
  .group-modal-go-back(v-if="$store.state.modal.lastUser"
                       slot="header-icon"
                       @click="backToUserModal")
    icon-back(color="var(--primary-color-on-bg)" :size="16")
  icon-profile-fill(v-else color="var(--primary-color-on-bg)" slot="header-icon" :size="22")
  .group-modal
    .group-user-list.is-scroll
      member-element.group-user-element(v-for="member in members" :model="member" :key="member.userId" backgroundColor="var(--background-color)")
</template>

<script>
import { mapState } from 'vuex'
import MemberElement from '@/components/Main/Sidebar/Content/MemberElement'
import BaseCommonModal from '@/components/Main/Modal/BaseCommonModal'
import IconProfileFill from '@/components/Icon/IconProfileFill'
import IconBack from '@/components/Icon/IconBack'

export default {
  name: 'GroupModal',
  components: {
    BaseCommonModal,
    MemberElement,
    IconProfileFill,
    IconBack
  },
  methods: {
    closeModal () {
      this.$store.dispatch('modal/close')
    },
    backToUserModal () {
      this.$store.dispatch('openUserModal', this.$store.state.modal.lastUser.userId)
    }
  },
  computed: {
    ...mapState('modal', ['data']),
    ...mapState(['memberMap']),
    members () {
      return this.data.members.map(memberId => this.memberMap[memberId])
    }
  }
}
</script>

<style lang="sass">
.group-modal-description
  max-width: calc(80vw - 4rem)
  font-size: 1.3rem
  margin: 1rem 2rem 0.5rem 2rem
  overflow-wrap: break-word
.group-user-list
  max-height: 50vh
  overflow-y: scroll
  border: 1px solid #eeeeee
  background-color: $background-color
  -webkit-overflow-scrolloing: touch
.group-modal-go-back
  cursor: pointer
</style>
