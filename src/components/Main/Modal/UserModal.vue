<template lang="pug">
.user-modal(:data-is-expanded="expandProfile" @click.stop="")
  // ユーザー情報本体
  .user-modal-area--profile(@click="toggleExpandProfile")
    .user-modal-close-wrap
      .user-modal-close(@click="close")
        icon-close(color="white" :size="16")
    user-modal-profile(:expanded="expandProfile")
  // タグなど
  .user-modal-area--extra
    .user-modal-tabs-container
      modal-tabs(v-model="activeExtraComponent" :options="extraComponents")
        template(slot="UserModalTags")
          IconTag(:size="20" color="var(--primary-color-on-bg)")
          .user-modal-tabs-pane-text
            | TAGS
        template(slot="UserModalGroups")
          IconProfileFill(:size="20" color="var(--primary-color-on-bg)")
          .user-modal-tabs-pane-text
            | GROUPS
    keep-alive
      component(:is="activeExtraComponent")
</template>

<script>
import { mapActions } from 'vuex'
import ModalTabs from '@/components/Main/Modal/Util/ModalTabs'
import UserModalProfile from '@/components/Main/Modal/UserModal/UserModalProfile'
import UserModalTags from '@/components/Main/Modal/UserModal/UserModalTags'
import UserModalGroups from '@/components/Main/Modal/UserModal/UserModalGroups'
import IconClose from '@/components/Icon/IconClose'
import IconTag from '@/components/Icon/IconTag'
import IconProfileFill from '@/components/Icon/IconProfileFill'

export default {
  name: 'UserModal',
  components: {
    ModalTabs,
    UserModalProfile,
    UserModalTags,
    UserModalGroups,
    IconClose,
    IconTag,
    IconProfileFill
  },
  data () {
    return {
      expandProfile: false,
      activeExtraComponent: 'UserModalTags',
      extraComponents: ['UserModalTags', 'UserModalGroups']
    }
  },
  methods: {
    toggleExpandProfile () {
      this.expandProfile = !this.expandProfile
    },
    ...mapActions('modal', ['close'])
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
  +mq(pc)
    flex-direction: row
  +mq(sp)
    flex-direction: column

.user-modal-close-wrap
  width: 100%
  display: flex
  justify-content: end
.user-modal-close
  opacity: 0.3
  margin-left: auto
  cursor: pointer
  &:hover
    opacity: 1

.user-modal-area--profile
  +mq(pc)
    border-radius: $modal-border-radius 0 0 $modal-border-radius
  +mq(sp)
    border-radius: $modal-border-radius $modal-border-radius 0 0
  padding: $modal-profile-padding
  background: $primary-color
  flex-grow: 2
  flex-shrink: 1
  transition: height .3s ease, width .3s ease

.user-modal-area--extra
  flex-grow: 3
  flex-shrink: 3
  min-height: 0
  display: flex
  flex-direction: column

@keyframes delayedOpacityChange
  0%
    opacity: 1
    width: 100%
  50%
    opacity: 0
    width: 100%
  100%
    opacity: 0
    width: 0

@keyframes delayedOpacityChangeReversed
  0%
    opacity: 0
    width: 0
  50%
    opacity: 0
    width: 100%
  100%
    opacity: 1
    width: 100%

.user-modal:not([data-is-expanded])
  .user-modal-area--profile
    +mq(pc)
      width: $profile-area-width
    +mq(sp)
      height: calc(#{$profile-area-height} + 18px)
  .user-modal-area--extra
    width: 100%
    opacity: 1
    animation: delayedOpacityChangeReversed .3s ease

.user-modal[data-is-expanded]
  .user-modal-area--profile
    border-radius: $modal-border-radius
    +mq(pc)
      width: $modal-profile-expanded-width
    +mq(sp)
      height: $modal-profile-expanded-height
  .user-modal-area--extra
    width: 0
    opacity: 0
    animation: delayedOpacityChange .3s ease

.user-modal-tabs-container
  margin-top: 1rem
  margin-bottom: 1rem
  +mq(pc)
    margin-left: 2rem
    margin-right: 2rem
  +mq(sp)
    margin-left: 1rem
    margin-right: 1rem

.user-modal-tabs-pane-text
  margin-left: 1rem
  color: $primary-color-on-bg
  font:
    size: 1.2rem
    weight: 400
  @media (max-width: 900px)
    display: none
</style>

