<template lang="pug">
div.user
  modal(@close="closeModal" :active="active")
    div.user-modal
      div.user-modal-profile-container
        div.user-modal-img(:style="profileContainerStyle")
        div.user-modal-gradient
        div.user-modal-profile
          div.user-modal-dm(v-on:click="openDirectMessage")
            div.user-modal-dm-icon
              div.user-modal-dm-indicator(v-if="hasUnreadMessages")
              div.fas.fa-envelope
            div.user-modal-button
              | Direct Message
          div.user-modal-display-name
            | {{model.displayName}}
          div.user-modal-name
            | @{{model.name}}
      div.user-modal-detail-container
        div.user-modal-detail-header
          div.fas.fa-tags
          | TAGS
        div.user-modal-detail.user-modal-tag
          div.user-modal-tag-element(v-for="(tag, index) in tags")
            div.user-modal-icon--gray.user-modal-tag-icon
              div.fas.fa-tag
            div.user-modal-tag-body(v-on:click="openTagModal(tag.tagId)")
              | {{tag.tag}}
            div.user-modal-tag-status-icon(v-if="tag.editable")
              div.user-modal-icon--gray(v-show="hasAuth && !tag.isLocked" v-on:click="lockTag(index)")
                i.fas.fa-lock-open
              div.user-modal-icon--gray(v-show="!tag.isLocked" v-on:click="eraseTag(index)")
                i.fas.fa-times
              div.user-modal-icon--gray(v-show="hasAuth && tag.isLocked" v-on:click="unlockTag(index)")
                i.fas.fa-lock
              div.user-modal-icon--gray.non-clickable(v-show="!hasAuth && tag.isLocked")
                i.fas.fa-lock
        div.user-modal-detail-input-container
          div.user-modal-detail-input
            div.user-modal-icon--gray.user-modal-tag-icon(:style="detailInputIconStyle")
              div.fas.fa-tag
            input.user-modal-tag-body(v-model="tagInput" v-on:keydown="keydown" placeholder="タグを追加……")
            div.user-modal-icon--gray.user-modal-plus-icon(v-on:click="addTag" :style="detailInputIconStyle")
              i.fas.fa-plus
</template>

<script>
import client from '@/bin/client'
export default {
  name: 'User',
  data () {
    return {
      tagInput: ''
    }
  },
  methods: {
    closeModal () {
      this.$store.commit('closeUserModal')
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
      client.addUserTag(this.model.userId, this.tagInput)
      .then(() => {
        this.tagInput = ''
      })
    },
    eraseTag (id) {
      client.deleteUserTag(this.model.userId, this.tags[id].tagId)
    },
    lockTag (id) {
      client.changeLockUserTag(this.model.userId, this.tags[id].tagId, true)
    },
    unlockTag (id) {
      client.changeLockUserTag(this.model.userId, this.tags[id].tagId, false)
    },
    openDirectMessage () {
      this.$router.push(`/users/${this.model.name}`)
      this.closeModal()
    }
  },
  computed: {
    directMessageChannel () {
      if (this.model.userId === this.$store.state.me.userId) {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.length === 1)
      } else {
        return this.$store.getters.getDirectMessageChannels.find(channel => channel.member && channel.member.some(userId => userId === this.model.userId))
      }
    },
    hasUnreadMessages () {
      if (this.directMessageChannel) {
        return this.$store.getters.getChannelUnreadMessageNum(this.directMessageChannel.channelId) > 0
      } else {
        return false
      }
    },
    active () {
      if (this.$store.state.userModal) {
        return true
      } else {
        return false
      }
    },
    model () {
      return this.$store.state.userModal || {}
    },
    tags () {
      const current = this.$store.state.currentUserTags
      return current.filter(tag => !tag.editable).concat(current.filter(tag => tag.editable))
    },
    hasAuth () {
      if (this.$store.state.userModal) {
        return this.$store.state.userModal.name === this.$store.state.me.name
      }
      return false
    },
    profileContainerStyle () {
      return {
        backgroundImage: `url(${this.$store.state.baseURL}/api/1.0/users/${this.model.userId}/icon)`
      }
    },
    detailInputIconStyle () {
      return {
        color: this.tagInput.length > 0 ? 'gray' : 'lightgray'
      }
    }
  }
}
</script>
<style lang="sass">
.user-modal
  display: grid
  height: 600px
  @media (min-width: 680px)
    grid-template-columns: minmax(200px, auto) 55%
    grid-template-areas: "profile detail"
  @media (max-width: 679px)
    grid-template-rows: 300px calc(100% - 300px)
    grid-template-areas: "profile""detail"

  .user-modal-profile-container
    grid-area: profile
    position: relative
    display: flex
    align-items: center
    justify-content: center
    .user-modal-img
      position: absolute
      height: 100%
      width: 100%
      z-index: -1
      background-repeat: no-repeat
      background-position: center
      background-size: cover
    .user-modal-gradient
      position: absolute
      width: 100%
      height: 100%
      z-index: -1
      background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(156, 178, 203, 0.38674) 0.01%, #003778 99.45%);
    .user-modal-profile
      display: grid
      grid-template-rows: 1fr auto auto
      height: calc(100% - 5rem)
      width: calc(100% - 4rem)
      flex-direction: column
      color: white
      .user-modal-dm
        display: flex
        align-items: center
        justify-content: center
        align-self: center
        height: 100%
        cursor: pointer
        @media (min-width: 680px)
          font-size: 1.75rem
        @media (max-width: 679px)
          font-size: 1.25rem
        .user-modal-dm-icon
          .fa-envelope
            margin-right: 1em
          .user-modal-dm-indicator
            $indicator-size: 0.4em
            position: absolute
            height: $indicator-size
            width: $indicator-size
            transform: translate(calc(-#{$indicator-size} / 2), calc(-#{$indicator-size} / 6))
            border-radius: 50%
            background: #EB5757
      .user-modal-display-name::before
        content: "";
        display: block;
        border-top: 1px solid white;
        transform: translateY(-1.5rem);
      .user-modal-display-name
        font-size: 2rem
        margin: 0.2rem 0px
      .user-modal-name
        font-size: 1.2rem

  .user-modal-detail-container
    $header-height: 5rem
    $input-height: 4rem
    grid-area: detail
    display: grid
    grid-template-rows: $header-height calc(100% - #{$header-height} - #{$input-height}) $input-height
    @media (min-width: 680px)
      height: inherit
    @media (max-width: 679px)
      height: 100%
    .user-modal-detail-header
      height: 100%
      width: 100%
      display: flex
      justify-content: center
      align-items: center
      color: gray
      font-size: 1.5rem
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1)
      .fas
        margin-right: 1rem

    .user-modal-detail
      overflow-y: scroll
      height: 100%
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1)

    .user-modal-detail-input-container
      display: flex
      align-items: center
      justify-content: center
      .user-modal-detail-input
        height: 2.2rem
        width: calc(100% - 3rem)
        display: flex
        align-items: center
        background: white
        border: 1px solid lightgray
        .user-modal-icon--gray
          transition: color .2s
        .user-modal-tag-icon
          margin-left: 1rem
          margin-right: 2rem
        input
          border: none
          width: calc(100% - 5rem)
        .user-modal-plus-icon
          margin-left: 2rem
          margin-right: 1.5rem

.user-modal-tag-element
  $gap: 2rem
  display: grid
  grid-template-columns: 1rem calc(100% - 5rem - #{$gap} * 2) 4rem
  grid-gap: $gap
  @media (min-width: 680px)
    margin: 1.3rem 2.5rem
  @media (max-width: 679px)
    margin: 1rem 2rem
  .user-modal-tag-icon
    justify-self: center
    display: flex
    align-items: center
    height: 100%
  .user-modal-tag-body
    flex: auto
    word-wrap: break-word
  .user-modal-tag-status-icon
    display: flex
    justify-content: flex-end
    align-items: center
    > .user-modal-icon--gray
      margin: 0px 0.5rem
      cursor: pointer

.user-modal-icon--gray
  color: gray
.user-modal-icon--blue
  color: #3a4891
.non-clickable
  cursor: default !important
</style>
