<template lang="pug">
.user-modal(:data-is-expanded="expandProfile" @click.stop="")
  // ユーザー情報本体
  .user-modal-area--profile(@click="toggleExpandProfile")
    UserModalProfile(:expanded="expandProfile")
  // タグなど
  .user-modal-area--extra
    component(:is="activeExtraComponent")
</template>

<script>
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
      expandProfile: false,
      activeExtraComponent: 'UserModalTags'
    }
  },
  methods: {
    toggleExpandProfile () {
      this.expandProfile = !this.expandProfile
    }
  },
  computed: {
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

