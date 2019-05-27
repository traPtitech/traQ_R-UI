<template lang="pug">
.member-element(:class="{'is-watched': isWatched}")
  .member-element-icon-container(@click="openUserModal")
    .member-element-icon(:style="iconStyle" v-lazy:background-image="userIconSrc")
    .member-element-unread-indicator(v-if="unreadMessagesNum > 0" :style="borderStyle")
    .member-element-online-indicator(v-if="!model.bot && model.isOnline" :style="borderStyle")
  .member-name-container(@click="openDMChannel")
    p.member-display-name.text-ellipsis
      | {{model.displayName}}
    p.member-name.text-ellipsis
      | @{{model.name}}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MemberElement',
  props: {
    model: Object,
    backgroundColor: {
      tyle: String,
      default: 'var(--primary-color)'
    }
  },
  methods: {
    openUserModal() {
      this.$store.dispatch('modal/openUserModal', this.model.userId)
    },
    openDMChannel() {
      this.$store.commit('closeSidebar')
      this.$store.commit('contractTitlebar')
      if (this.model.bot) {
        return
      }
      this.$router.push(`/users/${this.model.name}`)
    }
  },
  computed: {
    ...mapGetters(['fileUrl']),
    userIconSrc() {
      return this.fileUrl(this.model.iconFileId)
    },
    unreadMessagesNum() {
      return this.model.unread
    },
    iconStyle() {
      return {
        borderColor: this.backgroundColor
      }
    },
    borderStyle() {
      return {
        borderColor: this.isWatched ? 'white' : this.backgroundColor
      }
    },
    isWatched() {
      if (this.$route.params.user)
        return this.$route.params.user === this.model.name
      else return false
    }
  }
}
</script>

<style lang="sass">
.member-element
  cursor: pointer
  display: flex
  flex-flow: row
  align-items: center
  padding: 5px 10px
  &:hover
    background: rgba(0,0,0,0.1)

  &.is-watched
    background: white

.member-element-icon-container
  position: relative

.member-element-icon
  min-width: 40px
  width: 40px
  height: 40px
  border:
    radius: 100%
  overflow: hidden
  background:
    size: cover
    repeat: no-repeat
    position: center center
  .member-element-icon-container:hover &::before
    content: ''
    display: block
    position: absolute
    width: 100%
    height: 100%
    top: 0
    left: 0
    background: rgba(0,0,0,0.3)
    border:
      radius: 100%
      style: none

.member-element-unread-indicator
  position: absolute
  width: 12px
  height: 12px
  right: 0px
  top: -1px
  border:
    radius: 100%
    style: solid
    width: 2px
  background: $notification-color

  .member-element:hover(:not(.is-watched)) &
    border-color: var(--primary-color-hovered) !important

.member-element-online-indicator
  position: absolute
  width: 12px
  height: 12px
  right: 0px
  bottom: -3px
  border:
    radius: 100%
    style: solid
    width: 2px
  background: $online-color

  .member-element:hover(:not(.is-watched)) &
    border-color: var(--primary-color-hovered) !important

.member-display-name
  line-height: 1.5em

  .is-watched &
    color: var(--primary-color)

.member-name
  font:
    size: 0.9em
  line-height: 1.4em
  opacity: 0.6

  .is-watched &
    color: var(--primary-color)

.member-name-container
  margin: 0 0 0 10px
  min-width: 0
  width: 100%

.member-element > p
  padding-left: 10px
  white-space: nowrap
</style>
