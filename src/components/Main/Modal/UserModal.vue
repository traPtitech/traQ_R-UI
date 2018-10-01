<template lang="pug">
.user-modal(:data-is-expanded="expandProfile" @click.stop="")
  // ユーザー情報本体
  .user-modal-area--profile(@click="toggleExpandProfile")
    UserModalProfile(:expanded="expandProfile")
  // タグなど
  .user-modal-area--extra
    // タブを作って本体は外出し
    component(:is="activeExtraComponent")
</template>

<script>
import client from '@/bin/client'
import { mapState, mapGetters } from 'vuex'
import UserModalProfile from '@/components/Main/Modal/UserModal/UserModalProfile'
import UserModalTags from '@/components/Main/Modal/UserModal/UserModalTags'

export default {
  name: 'UserModal',
  components: {
    UserModalProfile,
    UserModalTags
  },
  data () {
    return {
      tagInput: '',
      expandProfile: false,
      activeExtraComponent: 'UserModalTags'
    }
  },
  methods: {
    closeModal () {
      this.$store.dispatch('modal/close')
      this.expandProfile = false
    },
    openTagModal (tagId) {
      this.$store.dispatch('openTagModal', tagId)
    },
    keydown (event) {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey || event.shiftKey)) {
        this.addTag()
        event.returnValue = false
      }
    },
    addTag () {
      if (this.tagInput === '') {
        return
      }
      client.addUserTag(this.data.userId, this.tagInput)
      .then(() => {
        this.tagInput = ''
        this.$store.dispatch('updateCurrentUserTags')
      })
    },
    eraseTag (id) {
      client.deleteUserTag(this.data.userId, this.tags[id].tagId)
      .then(() => {
        this.$store.dispatch('updateCurrentUserTags')
      })
    },
    lockTag (id) {
      client.changeLockUserTag(this.data.userId, this.tags[id].tagId, true)
      .then(() => {
        this.$store.dispatch('updateCurrentUserTags')
      })
    },
    unlockTag (id) {
      client.changeLockUserTag(this.data.userId, this.tags[id].tagId, false)
      .then(() => {
        this.$store.dispatch('updateCurrentUserTags')
      })
    },
    openDirectMessage () {
      this.$router.push(`/users/${this.data.name}`)
      this.closeModal()
    },
    toggleExpandProfile () {
      this.expandProfile = !this.expandProfile
    }
  },
  computed: {
    ...mapState('modal', ['data']),
    ...mapGetters('modal', ['isActive']),
    directMessageChannel () {
      if (this.data.userId === this.$store.state.me.userId) {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.length === 1)
      } else {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.some(userId => userId === this.data.userId))
      }
    },
    hasAuth () {
      if (this.$store.state.userModal) {
        return this.$store.state.userModal.name === this.$store.state.me.name
      }
      return false
    }
  }
}
</script>

<style lang="sass">
$profile-area-height: 20vh
$profile-area-width: 350px

.user-modal
  grid-template-columns: 100%
  display: flex
  @media (orientation: landscape)
    flex-direction: row
  @media (orientation: portrait)
    flex-direction: column

.user-modal-area--profile
  @media (orientation: landscape)
    border-radius: $modal-border-radius 0 0 $modal-border-radius
  @media (orientation: portrait)
    border-radius: $modal-border-radius $modal-border-radius 0 0
  padding: $modal-profile-padding
  background: $primary-color
  flex-grow: 1
  flex-shrink: 0
  transition: height .3s ease, width .3s ease

.user-modal-area--extra
  flex-grow: 3
  flex-shrink: 3
  min-height: 0
  display: flex

@keyframes delayedOpaciityChange
  0%
    opacity: 1
  50%
    opacity: 0
  100%
    opacity: 0

@keyframes delayedOpaciityChangeReversed
  0%
    opacity: 0
  50%
    opacity: 0
  100%
    opacity: 1

.user-modal:not([data-is-expanded])
  .user-modal-area--profile
    @media (orientation: landscape)
      width: $profile-area-width
    @media (orientation: portrait)
      height: $profile-area-height
  .user-modal-area--extra
    opacity: 1
    animation: delayedOpaciityChangeReversed .3s ease

.user-modal[data-is-expanded]
  .user-modal-area--profile
    border-radius: $modal-border-radius
    @media (orientation: landscape)
      width: $modal-profile-expanded-width
      +mq
        width: $modal-profile-expanded-width--wide
    @media (orientation: portrait)
      height: $modal-profile-expanded-height
  .user-modal-area--extra
    opacity: 0
    animation: delayedOpaciityChange .3s ease

</style>

