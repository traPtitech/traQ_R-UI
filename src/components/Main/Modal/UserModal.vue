<template lang="pug">
.user-modal(:data-is-expanded="expandProfile" @click.stop="")
  // ユーザー情報本体
  .user-modal-area--profile(@click="toggleExpandProfile")
    .user-modal-close-wrap
      .user-modal-close(@click="close")
        icon-close(color="white" :size="16")
    .user-modal-expand-wrap
      .user-modal-expand
        icon-down-direction(color="white" :size="22")
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
      component.user-modal-extra-component(:is="activeExtraComponent")
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
import IconDownDirection from '@/components/Icon/IconDownDirection'

export default {
  name: 'UserModal',
  components: {
    ModalTabs,
    UserModalProfile,
    UserModalTags,
    UserModalGroups,
    IconClose,
    IconTag,
    IconProfileFill,
    IconDownDirection
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
$profile-area-width: 400px

.user-modal
  grid-template-columns: 100%
  display: flex
  +mq(pc)
    flex-direction: row
  +mq(sp)
    flex-direction: column

.user-modal-close-wrap
  position: absolute
  width: 100%
  top: 0
  left: 0
  padding: 1rem
  display: flex
  justify-content: end
.user-modal-close
  opacity: 0.3
  margin-left: auto
  cursor: pointer
  &:hover
    opacity: 1

.user-modal-expand-wrap
  position: absolute
  +mq(pc)
    height: 100%
    top: 0
    right: 0
    flex-direction: column
  +mq(sp)
    width: 100%
    bottom: 0
    left: 0
    flex-direction: row
  padding: 1rem
  opacity: 0.3
  display: flex
  justify-content: center
  .user-modal-area--profile:hover &
    +mq(pc)
      opacity: 1
.user-modal-expand
  transition: transform 0.3s ease
  +mq(pc)
    transform: rotate(-90deg)
  +mq(sp)
    transform: rotate(0deg)
  .user-modal[data-is-expanded] &
    +mq(pc)
      transform: rotate(90deg)
    +mq(sp)
      transform: rotate(180deg)


.user-modal-area--profile
  +mq(pc)
    border-radius: $modal-border-radius 0 0 $modal-border-radius
    flex-grow: 1
    flex-shrink: 1
    padding-right: 2.5rem
  +mq(sp)
    border-radius: $modal-border-radius $modal-border-radius 0 0
    flex-grow: 0
    flex-shrink: 0
  padding: $modal-profile-padding
  position: relative
  background: $primary-color
  transition: height .3s ease, width .3s ease
  cursor: pointer

.user-modal-area--extra
  flex-grow: 3
  min-height: 0
  flex-shrink: 2
  height: 100%
  @media screen and (max-width: 900px)
    flex-shrink: 1

.user-modal-extra-component
  +mq(pc)
    height: calc(100% - 4.5rem)
  +mq(sp)
    height: calc(100% - 3.5rem)

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
    min-width: 0;
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

